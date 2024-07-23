import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { DecimalColumnTransformer } from 'src/config/pipes/decimal-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Features {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  dailyLimit: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  monthlyLimit: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  max: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  min: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  fee: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.DEPOSIT,
  })
  type: TransactionType;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
