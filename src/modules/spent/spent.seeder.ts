import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { Spent } from 'src/config/db/entities/spent.entity';
import { User } from 'src/config/db/entities/user.entity';

@Injectable()
export class SpentSeeder {
  constructor(
    @InjectRepository(Spent)
    private readonly spentRepository: Repository<Spent>,
  ) {}

  async seed(user: User) {
    const transactionsToSeed = [
      {
        lastAmount: 0,
        totalAmount: 0,
        dailySpent: 0,
        monthlySpent: 0,
        transactionType: TransactionType.DEPOSIT,
        user: user,
      },
      {
        lastAmount: 0,
        totalAmount: 0,
        dailySpent: 0,
        monthlySpent: 0,
        transactionType: TransactionType.WITHDRAWAL,
        user: user,
      },
      {
        lastAmount: 0,
        totalAmount: 0,
        dailySpent: 0,
        monthlySpent: 0,
        transactionType: TransactionType.SEND,
        user: user,
      },
      {
        lastAmount: 0,
        totalAmount: 0,
        dailySpent: 0,
        monthlySpent: 0,
        transactionType: TransactionType.RECEIVE,
        user: user,
      },
      {
        lastAmount: 0,
        totalAmount: 0,
        dailySpent: 0,
        monthlySpent: 0,
        transactionType: TransactionType.TRANSFORM,
        user: user,
      },
    ];

    for (const transactionData of transactionsToSeed) {
      try {
        
      } catch (error) {
        
      }
      const existingTransaction = await this.spentRepository.findOne({
        where: {
          user: user,
          transactionType: transactionData.transactionType,
        },
      });

      if (!existingTransaction) {
        const transaction = this.spentRepository.create(transactionData);
        await this.spentRepository.save(transaction);
      }
    }
  }
}
