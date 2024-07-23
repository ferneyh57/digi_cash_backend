import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { Coin } from 'src/config/db/entities/coin.entity';
import { CoinSeeder } from './coins.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Coin])],
  providers: [CoinsService, CoinSeeder],
  controllers: [CoinsController],
})
export class CoinsModule {}
