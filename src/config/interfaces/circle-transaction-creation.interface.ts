import { CircleFeeLevel } from "../enums/circle-fee-level.enum";

export interface CircleTransactionCreation {
    amounts: string[];
    destinationAddress: string;
    entitySecretCiphertext: string;
    feeLevel: CircleFeeLevel
    walletId: string;
  }