import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactions } from 'src/config/db/entities/transaction.entity';
import { TransactionStatus } from 'src/config/enums/transaction-status.enum';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { TransactionType } from 'src/config/enums/transaction-type.enum';

import { FeaturesService } from '../features/features.service';
import { Spent } from 'src/config/db/entities/spent.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Spent)
    private readonly spentRepository: Repository<Spent>,
    @InjectRepository(Transactions)
    private readonly transactionRepository: Repository<Transactions>,
    private readonly featuresService: FeaturesService,
  ) {}

  async createTransaction(
    transactionData: Partial<Transactions>,
  ): Promise<Transactions> {
    const newTransaction = this.transactionRepository.create({
      ...transactionData,
      status: TransactionStatus.PENDING,
    });

    const savedTransaction =
      await this.transactionRepository.save(newTransaction);
    return savedTransaction;
  }

  async findTransactionsByUserId(userId: string): Promise<Transactions[]> {
    const transactions = await this.transactionRepository.find({
      where: [{ wallet: { user: { id: userId } } }],
    });

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException(
        `No transactions found for user ID ${userId}`,
      );
    }

    return transactions;
  }

  async findTransactionById(id: string): Promise<Transactions> {
    return this.transactionRepository.findOneBy({ id });
  }

  async validateTransactionLimits(
    userId: string,
    type: TransactionType,
    amount: number,
  ): Promise<boolean> {
    const spent = await this.spentRepository.findOne({
      where: { user: { id: userId }, transactionType: type },
    });

    const feature = await this.featuresService.findByTransactionType(type);
    if (amount > feature.max || amount < feature.min) return false;
    if (!spent) return false;

    const newDailySpent = spent.dailySpent + amount;
    const newMonthlySpent = spent.monthlySpent + amount;

    return (
      newDailySpent <= feature.dailyLimit &&
      newMonthlySpent <= feature.monthlyLimit
    );
  }

}
