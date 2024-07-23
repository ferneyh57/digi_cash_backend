import { Module } from '@nestjs/common';
import { TransformController } from './transform.controller';
import { TransformService } from './transform.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { Wallet } from 'src/config/db/entities/wallet.entity';

@Module({
  controllers: [TransformController],
  imports: [
    WalletsModule,
    TransactionsModule,
    TypeOrmModule.forFeature([Wallet]),
  ],
  providers: [TransformService],
})
export class TransformModule {}
