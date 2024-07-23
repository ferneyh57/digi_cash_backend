import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { Coin } from 'src/config/db/entities/coin.entity';
import { User } from 'src/config/db/entities/user.entity';
import { CircleModule } from '../circle/circle.module';

@Module({
  imports: [
    CircleModule,
    TypeOrmModule.forFeature([Wallet, Coin, User]),
  ],
  providers: [WalletsService],
  controllers: [WalletsController],
  exports: [WalletsService],
})
export class WalletsModule {}
