import { normalizeSuiAddress } from '@mysten/sui.js/utils';

import { Network } from './network';

export const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const MAX_NUMBER_INPUT_VALUE = 9000000000000000;

export const LOCAL_STORAGE_VERSION = 'v5';

export const PAGE_SIZE = 50;

export const DEAD_ADDRESS = normalizeSuiAddress('0x0');

export const RPC_URL = {
  [Network.DEVNET]: 'https://sui.devnet.m2.movementlabs.xyz:443',
  [Network.TESTNET]: 'https://devnet.baku.movementlabs.xyz',
};

export const FAUCET_URL = {
  [Network.DEVNET]: 'https://sui.devnet.m2.movementlabs.xyz/faucet',
  [Network.TESTNET]: 'https://faucet.devnet.baku.movementlabs.xyz/faucet/web',
};

export const EXPLORER_URL = {
  [Network.DEVNET]: (path: string) =>
    `https://explorer.devnet.m2.movementlabs.xyz/${path}?network=devnet`,
  [Network.TESTNET]: (path: string) =>
    `https://explorer.devnet.baku.movementlabs.xyz/${path}`,
} as Record<Network, (path: string) => string>;

export const TOAST_DURATION = 10000;

export const EXCHANGE_FEE = 0.002;

export const PRICE_TYPE: Record<string, string> = {
  MOVE: '0x2::sui::SUI',
  ETH: '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
  WETH: '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
  BTC: '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN',
  WBTC: '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN',
  USDC: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
  USDT: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
};

export * from './coins';
export * from './network';
export * from './packages';
export * from './routes';
