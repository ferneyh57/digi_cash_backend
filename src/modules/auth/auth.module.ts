import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { SpentSeeder } from '../spent/spent.seeder';
import { Spent } from 'src/config/db/entities/spent.entity';
import { Coin } from 'src/config/db/entities/coin.entity';
import { User } from 'src/config/db/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
