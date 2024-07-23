import { Module } from '@nestjs/common';
import { SendService } from './send.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { Spent } from 'src/config/db/entities/spent.entity';
import { SendController } from './send.controller';
import { User } from 'src/config/db/entities/user.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { WalletsModule } from '../wallets/wallets.module';
import { CircleModule } from '../circle/circle.module';

@Module({
  imports: [
    TransactionsModule,
    WalletsModule,
    CircleModule,
    TypeOrmModule.forFeature([Spent, Wallet, User]),
  ],
  providers: [SendService],
  controllers: [SendController],
})
export class SendModule {}
