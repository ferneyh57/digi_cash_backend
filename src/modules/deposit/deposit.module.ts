import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { Transactions } from 'src/config/db/entities/transaction.entity';
import { Features } from 'src/config/db/entities/feature.entity';
import { Spent } from 'src/config/db/entities/spent.entity';
import { Coin } from 'src/config/db/entities/coin.entity';
import { User } from 'src/config/db/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { TransactionsModule } from '../transactions/transactions.module';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [
    TransactionsModule,
    WalletsModule,
    TypeOrmModule.forFeature([Wallet, Spent]),
  ],
  providers: [DepositService],
  controllers: [DepositController],
})
export class DepositModule {}
