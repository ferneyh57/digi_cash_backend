import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsInt,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSendToAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  receiverAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  fromWalletId: string;
}
