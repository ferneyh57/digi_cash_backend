import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsInt,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSendToUsernameDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  fromWalletId: string;
}
