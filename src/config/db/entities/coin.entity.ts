import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transactions } from './transaction.entity';
import { CoinType } from 'src/config/enums/coin-type.enum';
import { Wallet } from './wallet.entity';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  shortName: string;

  @Column({ nullable: true })
  imageSource: string;

  @Column('decimal', { precision: 10, scale: 2 })
  dollarRate: number;

  @Column({
    type: 'enum',
    enum: CoinType,
    default: CoinType.USDC,
  })
  type: CoinType;

  @OneToMany(() => Wallet, (wallet) => wallet.coin)
  transactions: Wallet[];

  @Column({ default: true })
  isCrypto: boolean;
}
