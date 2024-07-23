import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spent } from 'src/config/db/entities/spent.entity';

@Injectable()
export class SpentService {
  constructor(
    @InjectRepository(Spent)
    private spentRepository: Repository<Spent>,
  ) {}

  async findSpentByUserId(userId: string): Promise<Spent[]> {
    const spent = await this.spentRepository.find({
      where: { user: { id: userId } },
    });
    return spent;
  }
}
