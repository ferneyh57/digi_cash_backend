import { Controller, Get, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Get()
  findAll(@Req() request: Request) {
    const userId = request.user.id;
    return this.transactionsService.findTransactionsByUserId(userId);
  }
}
