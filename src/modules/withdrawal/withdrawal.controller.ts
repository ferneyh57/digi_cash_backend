import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WithdrawalService } from './withdrawal.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('withdrawal')
@ApiTags('withdrawal')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}
  @Post()
  create(
    @Body() createWithdrawaldDto: CreateWithdrawalDto,
    @Req() request: Request,
  ) {
    const id = request.user.id;
    return this.withdrawalService.createWithdrawal(createWithdrawaldDto, id);
  }
}
