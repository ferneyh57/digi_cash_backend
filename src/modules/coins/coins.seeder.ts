import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from 'src/config/db/entities/coin.entity';
import { CoinType } from 'src/config/enums/coin-type.enum';
import { Repository } from 'typeorm';

@Injectable()
export class CoinSeeder {
  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
  ) {}

  async seed() {
    const coinsToSeed: Partial<Coin>[] = [
      {
        name: 'US Dollar Coin',
        shortName: 'USDC',
        dollarRate: 1,
        imageSource: 'url-aqui',
        type: CoinType.USDC,
        isCrypto: true,
      },
      {
        name: 'Euro Coin',
        shortName: 'EURC',
        dollarRate: 1.2,
        imageSource: 'url-aqui',
        type: CoinType.EURC,
        isCrypto: true,
      },
      {
        name: 'Colombian Peso',
        shortName: 'COP',
        dollarRate: 0.00025,
        imageSource: 'url-aqui',
        type: CoinType.COP,
        isCrypto: false,
      },
    ];

    for (const coinData of coinsToSeed) {
      const existingCoin = await this.coinRepository.findOne({
        where: { type: coinData.type },
      });

      if (!existingCoin) {
        const coin = this.coinRepository.create(coinData);
        await this.coinRepository.save(coin);
      }
    }
  }
}