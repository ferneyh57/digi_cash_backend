import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsNotEmpty, IsUUID } from 'class-validator';

export class OpenWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  coinId: string;
}
