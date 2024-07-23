import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionType } from 'src/config/enums/transaction-type.enum';
import { CreateTransformDto } from './dto/create-transform.dto';
import { Wallet } from 'src/config/db/entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransformService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletsService: WalletsService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createTransform(createTransformDto: CreateTransformDto): Promise<void> {
    const fromWallet = await this.walletRepository.findOneBy({
      id: createTransformDto.fromWalletId,
    });
    const toWallet = await this.walletRepository.findOneBy({
      id: createTransformDto.fromWalletId,
    });
    await this.transactionsService.createTransaction({
      type: TransactionType.TRANSFORM,
      amount: createTransformDto.amount,
      wallet: fromWallet,
      fee: 0,
    });
    await this.walletsService.updateCurrentBalance(
      fromWallet.id,
      -createTransformDto.amount,
    );
    await this.walletsService.updateCurrentBalance(
      toWallet.id,
      createTransformDto.amount,
    );
  }
}
