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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        synchronize: true,
        autoLoadEntities: true,
      }),
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
    WebhooksModule,
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
