import { Module } from '@nestjs/common';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalService } from './withdrawal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { Spent } from 'src/config/db/entities/spent.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [
    WalletsModule,
    TransactionsModule,
    TypeOrmModule.forFeature([Wallet, Spent]),
  ],
  providers: [WithdrawalService],
  controllers: [WithdrawalController],
})
export class WithdrawalModule {}
