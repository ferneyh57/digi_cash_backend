import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateWithdrawalDto {
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
