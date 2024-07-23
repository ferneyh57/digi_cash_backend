import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsNotEmpty, IsInt, IsUUID } from 'class-validator';

export class CreateTransformDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  fromWalletId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  toWalletId: string;
}
