import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CircleFeeLevel } from 'src/config/enums/circle-fee-level.enum';
import { CircleNetworkType } from 'src/config/enums/circle-network-type.enum';
import { CircleWalletType } from 'src/config/enums/circle-wallet-type.enum';

import { uuid } from 'uuidv4';
@Injectable()
export class CircleService {
  private readonly usersWalletSetId = this.configService.get<string>(
    'CIRCLE_WALLET_SET_ID',
  );
  private readonly entitySecretCiphertext =
    this.configService.get<string>('CIRCLE_CIPHERTEXT');
  private readonly url = this.configService.get<string>('CIRCLE_URL');
  private readonly headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer ' + this.configService.get<string>('CIRCLE_KEY'),
  };
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}
  async createWallet(): Promise<{ id: string; address: string }> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          this.url + 'developer/wallets',
          {
            idempotencyKey: uuid(),
            accountType: CircleWalletType.EOA,
            blockchains: [CircleNetworkType.ETHSEPOLIA],
            count: 1,
            entitySecretCiphertext: this.entitySecretCiphertext,
            walletSetId: this.usersWalletSetId,
          },
          { headers: this.headers },
        ),
      );
      const { id, address } = response.data.data.wallets[0];
      return { id, address };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  async createTransaction(
    fromWalletId: string,
    receiverAddress: string,
    amount: string,
  ): Promise<{ id: string; status: string }> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          this.url + 'developer/transactions/transfer',
          {
            idempotencyKey: uuid(),
            amounts: [amount],
            destinationAddress: receiverAddress,
            entitySecretCiphertext: this.entitySecretCiphertext,
            feeLevel: CircleFeeLevel.LOW,
            walletId: fromWalletId,
          },
          { headers: this.headers },
        ),
      );
      const { id, status } = response.data.data;
      return { id, status };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getWalletBalance(walletId: string): Promise<{ amount: string }> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(this.url + 'wallets/' + walletId + '/balances', {
          headers: this.headers,
        }),
      );
      const amount = response.data.data.tokenBalances[0].amount;
      return amount;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async validateAddress(
    address: string,
    network: CircleNetworkType,
  ): Promise<{ result: boolean }> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          this.url + 'developer/transactions/transfer',
          { blockchain: network, address: address },
          { headers: this.headers },
        ),
      );
      const result = response.data.data.isValid;
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async estimateFee(
    amount: string,
    receiverAddress: string,
    senderAddress: string,
  ): Promise<{ cost: string }> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          this.url + 'developer/transactions/transfer',
          {
            amounts: [amount],
            destinationAddress: receiverAddress,
            sourceAddress: senderAddress,
          },
          { headers: this.headers },
        ),
      );
      const cost = response.data.data.low.baseFee;
      return cost;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
