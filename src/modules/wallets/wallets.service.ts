import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { Repository, UpdateResult } from 'typeorm';
import { OpenWalletDto } from './dto/create-wallet.dto';
import { Coin } from 'src/config/db/entities/coin.entity';
import { User } from 'src/config/db/entities/user.entity';
import { CircleService } from '../circle/circle.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly circleService: CircleService,
  ) {}

  async findAllByUserId(userId: string): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { user: { id: userId } },
    });
  }

  async create(openWalletDto: OpenWalletDto, userId: string): Promise<Wallet> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const coin = await this.coinRepository.findOneBy({
      id: openWalletDto.coinId,
    });

    let circleWalletId: string | null = null;
    let circleWalletAddress: string | null = null;

    if (coin.isCrypto) {
      const { id, address } = await this.circleService.createWallet();
      circleWalletId = id;
      circleWalletAddress = address;
    }

    const existingWallet = await this.walletRepository.findOneBy({
      coin: coin,
    });

    if (existingWallet) {
      throw new NotFoundException(
        `Wallet with this coin ID ${openWalletDto.coinId} already exists`,
      );
    }

    const newWallet = this.walletRepository.create({
      coin: coin,
      user: user,
      circleId: circleWalletId,
      circleAddress: circleWalletAddress,
    });

    return await this.walletRepository.save(newWallet);
  }
  async updateCurrentBalance(userId: string, amount: number): Promise<void> {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet for user ID ${userId} not found`);
    }
    wallet.currentBalance += amount;
    await this.walletRepository.save(wallet);
  }

  async updatePendingBalance(userId: string, amount: number): Promise<void> {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet for user ID ${userId} not found`);
    }
    wallet.pendingBalance += amount;
    await this.walletRepository.save(wallet);
  }
}
