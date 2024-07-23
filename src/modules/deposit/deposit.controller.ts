import { Body, Controller, Post, Req } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositDto } from './dto/create-deposit.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('deposit')
@ApiTags('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}
  @Post()
  create(@Body() depositDto: DepositDto, @Req() request: Request) {
    const id = request.user.id;
    return this.depositService.createDeposit(depositDto, id);
  }
}
