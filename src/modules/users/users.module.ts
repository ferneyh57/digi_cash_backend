import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from 'src/config/db/entities/user.entity';
import { Coin } from 'src/config/db/entities/coin.entity';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { Spent } from 'src/config/db/entities/spent.entity';
import { SpentSeeder } from '../spent/spent.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User, Coin, Wallet, Spent])],
  providers: [UsersService, SpentSeeder],
  controllers: [],
  exports: [UsersService], 
})
export class UsersModule {}