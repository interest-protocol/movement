import { isValidSuiAddress, normalizeSuiAddress } from '@mysten/sui.js/utils';
import BigNumber from 'bignumber.js';
import { propOr } from 'ramda';

import { CoinObject } from '@/components/web3-manager/coins-manager/coins-manager.types';
import { FixedPointMath } from '@/lib';
import { Quest } from '@/server/model/quest';
import { isBigNumberish } from '@/utils';

import { AirdropData } from './airdrop.types';

export const csvToAirdrop = (
  csv: string,
  onError: (message: string) => void
): AirdropData[] => {
  try {
    const lines = csv.split(',').map((x) => x.replace('\n', ''));

    const addresses = lines.filter(
      (x) => x.startsWith('0x') && isValidSuiAddress(normalizeSuiAddress(x))
    );
    const amounts = lines.filter(
      (x) => !x.startsWith('0x') && isBigNumberish(x)
    );

    if (addresses.length !== amounts.length)
      throw new Error('Numbers of addresses and numbers do not match');

    const data = [] as AirdropData[];

    addresses.forEach((address, i) => {
      data.push({
        address,
        amount: amounts[i],
      });
    });

    return data;
  } catch (error) {
    onError(propOr('Something went wrong', 'message', error));
    return [];
  }
};

export const textToAirdrop = (
  text: string,
  commonAmount: string,
  decimals: number,
  onError: (message: string) => void
): AirdropData[] => {
  try {
    const lines = text.split('\n');
    const addresses = lines.filter((x) => isValidSuiAddress(x));

    const data = [] as AirdropData[];

    addresses.forEach((address) => {
      data.push({
        address,
        amount: FixedPointMath.toBigNumber(commonAmount, decimals).toString(),
      });
    });

    return data;
  } catch (error) {
    onError(propOr('Something went wrong', 'message', error));
    return [];
  }
};

export const convertTypeToShortPackedId = (type: string): string => {
  const packageId = type.split('::')[0];

  if (packageId.length < 10) return packageId;

  return `${packageId.slice(0, 6)}...${packageId.slice(-4)}`;
};

export const logAirdrop = (
  address: string,
  token: CoinObject,
  amount: BigNumber,
  addressesCount: number,
  txDigest: string
) => {
  fetch('/api/v1/log-quest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': 'Content-Type',
      'Access-Control-Request-Method': 'POST',
    },
    body: JSON.stringify({
      address,
      txDigest,
      kind: 'airdrop',
      data: {
        coin: {
          type: token.type,
          symbol: token.symbol,
          amount: String(FixedPointMath.toNumber(amount, token.decimals)),
        },
        addressesCount,
      },
    } as Omit<Quest, 'timestamp'>),
  });
};
