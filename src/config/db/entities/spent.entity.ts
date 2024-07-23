import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from './user.entity'; // Asumiendo que tienes una entidad User definida
import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { DecimalColumnTransformer } from 'src/config/pipes/decimal-transformer';

@Entity()
export class Spent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  lastAmount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  totalAmount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  dailySpent: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  monthlySpent: number;

  @Column({ type: 'timestamp', nullable: true })
  lastTransactionDate: Date;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transactionType: TransactionType;

  @ManyToOne(() => User, (user) => user.spent)
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  updateSpentAmounts() {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (!this.lastTransactionDate || this.lastTransactionDate < startOfDay) {
      this.dailySpent = 0;
    }

    if (!this.lastTransactionDate || this.lastTransactionDate < startOfMonth) {
      this.monthlySpent = 0;
    }
    this.totalAmount += this.lastAmount;
    this.dailySpent += this.lastAmount;
    this.monthlySpent += this.lastAmount;
    this.lastTransactionDate = now;
  }
}
