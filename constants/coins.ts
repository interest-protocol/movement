import { SUI_TYPE_ARG } from '@mysten/sui.js/utils';

import { CoinData } from '@/interface';

export const MOVE_TYPE_ARG = '0x2::move::MOVE';

const MOVEMENT_MOCK_COINS_PACKAGE =
  '0x457abead7283c8af79b0902e71decf173f88624fe8dd2e76be97b6132c39e9c9';

const MOVEMENT_MOCK_IMOLA_PACKAGE =
  '0x8ac626e474c33520a815175649fefcbb272678c8c37a7b024e7171fa45d47711';

export const WBTC_TYPE = `${MOVEMENT_MOCK_COINS_PACKAGE}::wbtc::WBTC`;

export const WETH_TYPE = `${MOVEMENT_MOCK_COINS_PACKAGE}::weth::WETH`;

export const USDC_TYPE = `${MOVEMENT_MOCK_COINS_PACKAGE}::usdc::USDC`;

export const USDT_TYPE = `${MOVEMENT_MOCK_COINS_PACKAGE}::usdt::USDT`;

export const RUCO_TYPE =
  '0x935aae204191927c7f1586a11c011da5fafb57fa51bd1df60484954c18862891::ruco::RUCO';

export const TREASURY_CAP_MAP = {
  [USDC_TYPE]:
    '0x1292ab377437c97bc6dfead6b502c0a40c1cdd84d3b5c7c98ad6a303bec52897',
  [WETH_TYPE]:
    '0x2edacfae4858522ae6cff36d8acc05a255b9b4403bd7e56d9b0ca6664edc25be',
  [WBTC_TYPE]:
    '0x0401a6b9b03b694d16fe9806389625beb6d801f64a188d39aecfc090c5dce2fd',
  [USDT_TYPE]:
    '0x54e04baa0fa5bf840efb48e44afb1c388690e8d52cf874a012edaa5fa487ab27',
} as Record<string, string>;

export const IMOLA_TREASURY_CAP_MAP = {
  [USDC_TYPE]:
    '0x6bad1a88caef6f9ea56680cd31315b2cfeb6018b105471320407559042e6d067',
  [WETH_TYPE]:
    '0xe02ba3510a9240ba970aed72e0c6188989c3e6d6bd316edfa12bd04da8ebf675',
  [WBTC_TYPE]:
    '0xd2c1127a16494f9df5b6f973baebd78e093d66b3c06463c4e930c8545a9b6df2',
  [USDT_TYPE]:
    '0x8cacf2fd727720db5fc11006786fbcf69408decda4611921da791cc8ed844878',
} as Record<string, string>;

export const FAUCET_AMOUNT = {
  [USDC_TYPE]: '5000000000',
  [WETH_TYPE]: '5000000000',
  [WBTC_TYPE]: '100000000',
  [USDT_TYPE]: '7000000000000',
} as Record<string, string>;

export const FAUCET_COINS: ReadonlyArray<CoinData> = [
  {
    decimals: 9,
    symbol: 'MOVE',
    type: SUI_TYPE_ARG,
  },
  {
    decimals: 9,
    symbol: 'WBTC',
    type: WBTC_TYPE,
  },
  {
    decimals: 9,
    symbol: 'WETH',
    type: WETH_TYPE,
  },
  {
    decimals: 6,
    symbol: 'USDC',
    type: USDC_TYPE,
  },
  {
    decimals: 9,
    symbol: 'USDT',
    type: USDT_TYPE,
  },
];

export const COINS: ReadonlyArray<CoinData> = [
  ...FAUCET_COINS,
  {
    decimals: 9,
    symbol: 'RUCO',
    type: RUCO_TYPE,
  },
];

export const COINS_MAP: Record<string, CoinData> = {
  [SUI_TYPE_ARG]: {
    decimals: 9,
    symbol: 'MOVE',
    type: SUI_TYPE_ARG,
  },
  [WBTC_TYPE]: {
    decimals: 9,
    symbol: 'WBTC',
    type: WBTC_TYPE,
  },
  [WETH_TYPE]: {
    decimals: 9,
    symbol: 'ETH',
    type: WETH_TYPE,
  },
  [USDC_TYPE]: {
    decimals: 6,
    symbol: 'USDC',
    type: USDC_TYPE,
  },
  [USDT_TYPE]: {
    decimals: 9,
    symbol: 'USDT',
    type: USDT_TYPE,
  },
  [RUCO_TYPE]: {
    decimals: 9,
    symbol: 'RUCO',
    type: RUCO_TYPE,
  },
};

export const PRICE_BLACKLIST = ['RUCO'];
