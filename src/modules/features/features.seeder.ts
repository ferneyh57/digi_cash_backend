import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { Features } from 'src/config/db/entities/feature.entity';

@Injectable()
export class FeaturesSeeder {
  constructor(
    @InjectRepository(Features)
    private readonly featuresRepository: Repository<Features>,
  ) {}

  async seed() {
    const featuresData: Partial<Features>[] = [
      {
        dailyLimit: 1000,
        monthlyLimit: 30000,
        max: 5000,
        min: 10,
        fee: 2.5,
        type: TransactionType.DEPOSIT,
        isActive: true,
      },
      {
        dailyLimit: 500,
        monthlyLimit: 15000,
        max: 2500,
        min: 5,
        fee: 1.5,
        type: TransactionType.WITHDRAWAL,
        isActive: true,
      },
      {
        dailyLimit: 1000,
        monthlyLimit: 30000,
        max: 5000,
        min: 10,
        fee: 2.0,
        type: TransactionType.SEND,
        isActive: true,
      },
      {
        dailyLimit: 1000,
        monthlyLimit: 30000,
        max: 5000,
        min: 10,
        fee: 2.0,
        type: TransactionType.RECEIVE,
        isActive: true,
      },
      {
        dailyLimit: 800,
        monthlyLimit: 24000,
        max: 4000,
        min: 8,
        fee: 1.8,
        type: TransactionType.TRANSFORM,
        isActive: true,
      },
    ];

    for (const featureData of featuresData) {
      const existingFeature = await this.featuresRepository.findOne({
        where: { type: featureData.type },
      });

      if (!existingFeature) {
        const feature = this.featuresRepository.create(featureData);
        await this.featuresRepository.save(feature);
      }
    }
  }
}