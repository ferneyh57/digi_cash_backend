import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { CreateSendToAddressDto } from './dto/create-send-to-address.dto';
import { CreateSendToUsernameDto } from './dto/create-send-to-username.dto';
import { CircleService } from '../circle/circle.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Spent } from 'src/config/db/entities/spent.entity';
import { Repository } from 'typeorm';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { CoinType } from 'src/config/enums/coin-type.enum';
import { User } from 'src/config/db/entities/user.entity';

@Injectable()
export class SendService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletsService: WalletsService,
    private readonly circleService: CircleService,
    @InjectRepository(Spent)
    private readonly spentRepository: Repository<Spent>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createSendToAddress(
    createSendDto: CreateSendToAddressDto,
    userId: string,
  ): Promise<void> {
    await this.transactionsService.validateTransactionLimits(
      userId,
      TransactionType.SEND,
      createSendDto.amount,
    );

    const wallet = await this.findWalletByIdAndUserId(
      createSendDto.fromWalletId,
      userId,
    );

    await this.circleService.createTransaction(
      wallet.circleId,
      createSendDto.receiverAddress,
      createSendDto.amount.toString(),
    );
    await this.transactionsService.createTransaction({
      type: TransactionType.SEND,
      amount: createSendDto.amount,
      wallet,
      fromUser: wallet.user,
    });

    await this.walletsService.updateCurrentBalance(
      wallet.id,
      -createSendDto.amount,
    );

    await this.updateSpentAmount(
      userId,
      TransactionType.SEND,
      createSendDto.amount,
    );
  }

  async createSendToUsername(
    createSendToUsernameDto: CreateSendToUsernameDto,
    userId: string,
  ): Promise<void> {
    await this.transactionsService.validateTransactionLimits(
      userId,
      TransactionType.SEND,
      createSendToUsernameDto.amount,
    );

    const receiverUser = await this.findUserByUsername(
      createSendToUsernameDto.username,
    );

    const senderWallet = await this.findWalletByIdAndUserId(
      createSendToUsernameDto.fromWalletId,
      userId,
    );

    const receiverWallet = await this.findReceiverWallet(
      senderWallet.coin.type,
      receiverUser.id,
    );

    if (senderWallet.coin.type !== CoinType.COP) {
      await this.circleService.createTransaction(
        senderWallet.circleId,
        createSendToUsernameDto.amount.toString(),
        receiverWallet.circleAddress,
      );
    }
    await this.transactionsService.createTransaction({
      type: TransactionType.SEND,
      amount: createSendToUsernameDto.amount,
      wallet: senderWallet,
      fromUser: senderWallet.user,
      toUser: senderWallet.user,
    });

    await this.walletsService.updateCurrentBalance(
      senderWallet.id,
      -createSendToUsernameDto.amount,
    );

    await this.updateSpentAmount(
      userId,
      TransactionType.SEND,
      createSendToUsernameDto.amount,
    );
  }

  private async findWalletByIdAndUserId(
    walletId: string,
    userId: string,
  ): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId, user: { id: userId } },
    });
    if (!wallet) {
      throw new BadRequestException(`Invalid wallet with id ${walletId}`);
    }
    return wallet;
  }

  private async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException(`Invalid receiver username ${username}`);
    }
    return user;
  }

  private async findReceiverWallet(
    coinType: CoinType,
    userId: string,
  ): Promise<Wallet> {
    return await this.walletRepository.findOne({
      where: { user: { id: userId }, coin: { type: coinType } },
    });
  }

  private async updateSpentAmount(
    userId: string,
    transactionType: TransactionType,
    amount: number,
  ): Promise<void> {
    let spentEntity = await this.spentRepository.findOne({
      where: { user: { id: userId }, transactionType },
    });

    if (!spentEntity) {
      throw new BadRequestException(
        'Spent entity not found for user id ' + userId,
      );
    }

    spentEntity.lastAmount = amount;
    await this.spentRepository.save(spentEntity);
  }
}
