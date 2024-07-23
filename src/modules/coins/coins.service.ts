import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from 'src/config/db/entities/coin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
  ) {}

  async findAll(): Promise<Coin[]> {
    return this.coinRepository.find();
  }
}
