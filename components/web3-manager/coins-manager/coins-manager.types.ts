import { CoinMetadata, CoinStruct, SuiClient } from '@mysten/sui.js/client';
import BigNumber from 'bignumber.js';

import { Network } from '@/constants';
import { UseCoinsResponse } from '@/hooks/use-coins/use-coins.types';

export interface CoinObject extends Pick<CoinMetadata, 'symbol' | 'decimals'> {
  digest?: string;
  version?: string;
  balance: BigNumber;
  type: `0x${string}`;
  coinObjectId: string;
  previousTransaction?: string;
  lockedUntilEpoch?: number | null | undefined;
  metadata: Omit<CoinMetadata, 'symbol' | 'decimals'>;
  objects: ReadonlyArray<Omit<CoinStruct, 'coinType'> & { type: string }>;
}

export type CoinsMap = Record<string, CoinObject>;

export type TGetAllCoins = (
  provider: SuiClient,
  account: string,
  updateCoins: (data: CoinsMap) => void,
  set: (
    partial: (
      state: UseCoinsResponse
    ) => UseCoinsResponse | Partial<UseCoinsResponse>
  ) => void,
  network: Network,
  cursor?: string | null
) => Promise<void>;
