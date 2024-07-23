import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsInt,
  isUUID,
  IsUUID,
} from 'class-validator';

export class DepositDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  fromWalletId: string;
}
