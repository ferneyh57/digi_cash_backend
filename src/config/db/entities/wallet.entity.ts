import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Coin } from './coin.entity';
import { User } from './user.entity';
import { Transactions } from './transaction.entity';
import { DecimalColumnTransformer } from 'src/config/pipes/decimal-transformer';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  circleAddress: string;

  @Column({ nullable: true })
  circleId: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  currentBalance: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  pendingBalance: number;

  @ManyToOne(() => Coin)
  coin: Coin;

  @OneToMany(() => Transactions, (transactions) => transactions.wallet)
  transactions: Transactions[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;
}
