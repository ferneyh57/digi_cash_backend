import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Features } from 'src/config/db/entities/feature.entity';
import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { Repository } from 'typeorm';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Features)
    private readonly featuresRepository: Repository<Features>,
  ) {}

  async findAll(): Promise<Features[]> {
    return this.featuresRepository.find();
  }

  async findByTransactionType(
    transactionType: TransactionType,
  ): Promise<Features> {
    return this.featuresRepository.findOne({
      where: { type: transactionType },
    });
  }
}
