import { Control, UseFormSetValue } from 'react-hook-form';

import { CoinObject } from '@/components/web3-manager/coins-manager/coins-manager.types';
import { CoinData } from '@/interface';

export interface TokenModalItemProps
  extends Omit<CoinData, 'decimals' | 'balance'> {
  selected: boolean;
  onClick: () => void;
}

export interface SelectTokenModalProps {
  faucet?: boolean;
  simple?: boolean;
  closeModal: () => void;
  onSelect: (coin: CoinObject) => void;
}

export interface SelectTokenFilterProps {
  control: Control<SearchTokenForm>;
  setValue: UseFormSetValue<SearchTokenForm>;
}

export enum TokenOrigin {
  Strict,
  Wallet,
}

export interface SearchTokenForm {
  search: string;
  filter: TokenOrigin;
}

export interface SelectTokenModalBodyProps
  extends Pick<SelectTokenModalProps, 'faucet'> {
  control: Control<SearchTokenForm>;
  handleSelectToken: (type: CoinObject) => void;
}

export interface ModalTokenBodyProps {
  loading: boolean;
  tokens: ReadonlyArray<CoinData>;
  handleSelectToken: (type: string) => void;
}

export interface ModalTokenSearchProps {
  search: string;
  handleSelectToken: (coin: CoinObject) => void;
}
