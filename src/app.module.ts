import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoinsModule } from './modules/coins/coins.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './config/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './config/db/entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CircleModule } from './modules/circle/circle.module';
import { Wallet } from './config/db/entities/wallet.entity';
import { Coin } from './config/db/entities/coin.entity';
import { Transactions } from './config/db/entities/transaction.entity';
import { DepositModule } from './modules/deposit/deposit.module';
import { WithdrawalModule } from './modules/withdrawal/withdrawal.module';
import { SendModule } from './modules/send/send.module';
import { TransformModule } from './modules/transform/transform.module';
import { FeaturesModule } from './modules/features/features.module';
import { SpentModule } from './modules/spent/spent.module';
import { Features } from './config/db/entities/feature.entity';
import { Spent } from './config/db/entities/spent.entity';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydatabase',
      synchronize: true, // No uses en producción: podría perder datos
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Coin,
      Transactions,
      Spent,
      Features,
    ]),
    CoinsModule,
    TransactionsModule,
    WalletsModule,
    CircleModule,
    DepositModule,
    WithdrawalModule,
    SendModule,
    TransformModule,
    FeaturesModule,
    SpentModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
