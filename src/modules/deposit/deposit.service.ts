import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletsService } from '../wallets/wallets.service';
import { DepositDto } from './dto/create-deposit.dto';
import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spent } from 'src/config/db/entities/spent.entity';
import { Wallet } from 'src/config/db/entities/wallet.entity';

@Injectable()
export class DepositService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletsService: WalletsService,
    @InjectRepository(Spent)
    private readonly spentRepository: Repository<Spent>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createDeposit(depositDto: DepositDto, userId: string): Promise<void> {
    await this.validateTransaction(depositDto.amount, userId);

    const wallet = await this.findUserWallet(depositDto.fromWalletId, userId);

    await this.createTransactionRecord(
      depositDto.amount,
      TransactionType.DEPOSIT,
      wallet,
    );

    await this.walletsService.updatePendingBalance(
      wallet.id,
      depositDto.amount,
    );

    await this.updateSpentAmount(
      userId,
      TransactionType.DEPOSIT,
      depositDto.amount,
    );
  }

  private async validateTransaction(
    amount: number,
    userId: string,
  ): Promise<void> {
    const isValid = await this.transactionsService.validateTransactionLimits(
      userId,
      TransactionType.DEPOSIT,
      amount,
    );
    if (!isValid) {
      throw new BadRequestException(
        'The deposit amount exceeds transaction limits',
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

  private async createTransactionRecord(
    amount: number,
    type: TransactionType,
    wallet: Wallet,
  ): Promise<void> {
    await this.transactionsService.createTransaction({
      type,
      amount,
      wallet,
      fromUser: wallet.user,
      fee: 0,
    });
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
