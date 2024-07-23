import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { Request } from 'express';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { ApiTags } from '@nestjs/swagger';
import { OpenWalletDto } from './dto/create-wallet.dto';

@Controller('wallets')
@ApiTags('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  async findAll(@Req() request: Request): Promise<Wallet[]> {
    const userId = request.user.id;
    return this.walletsService.findAllByUserId(userId);
  }

  @Post('open')
  async create(
    @Body() openWalletDto: OpenWalletDto,
    @Req() request: Request,
  ): Promise<Wallet> {
    const userId = request.user.id;
    return this.walletsService.create(openWalletDto, userId);
  }
}
