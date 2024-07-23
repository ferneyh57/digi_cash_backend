import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from 'src/config/db/entities/transaction.entity';
import { Spent } from 'src/config/db/entities/spent.entity';
import { FeaturesModule } from '../features/features.module';

@Module({
  imports: [FeaturesModule, TypeOrmModule.forFeature([Transactions, Spent])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
