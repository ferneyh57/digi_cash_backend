import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Spent } from './spent.entity';
import { Transactions } from './transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  country: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Spent, (spent) => spent.user)
  spent: Spent[];

  @OneToMany(() => Transactions, (transactions) => transactions.fromUser)
  sendTransactions: Transactions[];

  @OneToMany(() => Transactions, (transactions) => transactions.fromUser)
  receiveTransactions: Transactions[];
}
