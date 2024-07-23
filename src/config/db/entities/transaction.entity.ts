import { TransactionStatus } from 'src/config/enums/transaction-status.enum';
import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Wallet } from './wallet.entity';
import { DecimalColumnTransformer } from 'src/config/pipes/decimal-transformer';
import { User } from './user.entity'; // Importa la entidad User

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.DEPOSIT,
  })
  type: TransactionType;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new DecimalColumnTransformer(),
  })
  fee: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdate: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @ManyToOne(() => User, (user) => user.sendTransactions, { nullable: true })
  fromUser: User;

  @ManyToOne(() => User, (user) => user.receiveTransactions, { nullable: true })
  toUser: User;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
