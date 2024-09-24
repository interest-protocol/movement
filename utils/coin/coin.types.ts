import { CoinStruct, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import BigNumber from 'bignumber.js';

export interface CreateVectorParameterArgs {
  amount: string;
  account: string;
  suiClient: SuiClient;
  txb: TransactionBlock;
  type: `0x${string}` | string;
}

export interface GetCoinsArgs {
  suiClient: SuiClient;
  account: string;
  coinType: string;
  cursor?: string | null;
}

export interface GetSafeValueArgs {
  coinType: string;
  coinValue: string;
  decimals: number;
  balance: BigNumber;
}

export type TGetAllCoins = (
  provider: SuiClient,
  account: string,
  type: `0x${string}`,
  cursor?: string | null
) => Promise<ReadonlyArray<CoinStruct>>;
