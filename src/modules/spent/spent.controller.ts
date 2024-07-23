import { Controller, Get, Param } from '@nestjs/common';
import { SpentService } from './spent.service';
import { Spent } from 'src/config/db/entities/spent.entity';
import { ApiTags } from '@nestjs/swagger';
import { request } from 'express';

@Controller('spent')
@ApiTags('spent')
export class SpentController {
  constructor(private readonly spentService: SpentService) {}

  @Get()
  async findSpentByUserId(): Promise<Spent[]> {
    const id = request.user.id;
    return this.spentService.findSpentByUserId(id);
  }
}
