import { WalletAccount } from '@wallet-standard/base';
import BigNumber from 'bignumber.js';
import { UseFormReturn } from 'react-hook-form';

import { Network } from '@/constants';
import { CoinsMap } from '@/hooks/use-get-all-coins/use-get-all-coins.types';
import { Token } from '@/interface';

export interface ISwapSettings {
  slippage: string;
}
export interface SwapToken extends Token {
  display: string;
  usdPrice: number | null;
  isFetchingSwap?: boolean;
}

interface SwapTypeArgs {
  coinIn: string;
  coinOut: string;
  lpCoin: string;
}

export type SwapPath = ReadonlyArray<SwapTypeArgs>;

export interface SwapForm {
  to: SwapToken;
  from: SwapToken & { value: BigNumber };
  swapping: boolean;
  settings: ISwapSettings;
  lock: boolean;
  error?: string | null;
  loading: boolean;
  maxValue: boolean;
  disabled: boolean;
  swapPath: SwapPath;
  readyToSwap: boolean;
}

export interface SwapPreviewModalProps {
  onClose: () => void;
}

export interface SwapArgs {
  currentAccount: WalletAccount | null;
  coinsMap: CoinsMap;
  formSwap: UseFormReturn<SwapForm>;
  network: Network;
  isZeroSwap?: boolean;
}
