import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { Spent } from 'src/config/db/entities/spent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from 'src/config/db/entities/wallet.entity';

@Injectable()
export class WithdrawalService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletsService: WalletsService,
    @InjectRepository(Spent)
    private readonly spentRepository: Repository<Spent>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createWithdrawal(
    createWithdrawalDto: CreateWithdrawalDto,
    userId: string,
  ): Promise<void> {
    await this.validateWithdrawal(createWithdrawalDto.amount, userId);

    const wallet = await this.findUserWallet(
      createWithdrawalDto.fromWalletId,
      userId,
    );

    if (wallet.currentBalance < createWithdrawalDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    await this.transactionsService.createTransaction({
      type: TransactionType.WITHDRAWAL,
      amount: createWithdrawalDto.amount,
      wallet,
      fromUser: wallet.user,
      fee: 0,
    });

    await this.walletsService.updateCurrentBalance(
      wallet.id,
      -createWithdrawalDto.amount,
    );

    await this.updateSpentAmount(
      userId,
      TransactionType.WITHDRAWAL,
      createWithdrawalDto.amount,
    );
  }

  private async validateWithdrawal(
    amount: number,
    userId: string,
  ): Promise<void> {
    const isValid = await this.transactionsService.validateTransactionLimits(
      userId,
      TransactionType.WITHDRAWAL,
      amount,
    );
    if (!isValid) {
      throw new BadRequestException(
        'The withdrawal amount exceeds transaction limits',
      );
    }
  }

  private async findUserWallet(
    walletId: string,
    userId: string,
  ): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId, user: { id: userId } },
    });
    if (!wallet) {
      throw new BadRequestException(`Invalid wallet with id ${walletId}`);
    }
    if (!wallet.isActive) {
      throw new BadRequestException('Invalid inactive wallet');
    }

    if (wallet.coin.isCrypto) {
      throw new BadRequestException('Invalid cryto wallet');
    }
    return wallet;
  }

  private async updateSpentAmount(
    userId: string,
    transactionType: TransactionType,
    amount: number,
  ): Promise<void> {
    let spentEntity = await this.spentRepository.findOne({
      where: {
        user: { id: userId },
        transactionType,
      },
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
