import { Controller, Get, Post, Body } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { Coin } from 'src/config/db/entities/coin.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('coins')
@ApiTags('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Get()
  async findAll(): Promise<Coin[]> {
    return this.coinsService.findAll();
  }
}
