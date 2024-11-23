import { isEmpty } from 'ramda';

import { PRICE_TYPE } from '@/constants';
import { AmmPool, CoinMetadataWithType } from '@/interface';
import { FixedPointMath } from '@/lib';

export const getLiquidity = (
  pool: AmmPool,
  metadata: Record<string, CoinMetadataWithType>,
  prices: Record<string, number>
): number => {
  if (isEmpty(prices)) return 0;

  const priceX = metadata[pool.coinTypes.coinX]
    ? prices[PRICE_TYPE[metadata[pool.coinTypes.coinX]?.symbol]]
    : null;

  const priceY = metadata[pool.coinTypes.coinY]
    ? prices[PRICE_TYPE[metadata[pool.coinTypes.coinY]?.symbol]]
    : null;

  if (!priceX && !!priceY)
    return 2 * FixedPointMath.toNumber(pool.balanceY, pool.decimalsY) * priceY;

  if (!priceY && !!priceX)
    return 2 * FixedPointMath.toNumber(pool.balanceX, pool.decimalsX) * priceX;

  if (priceX && priceY)
    return (
      FixedPointMath.toNumber(pool.balanceY, pool.decimalsY) * priceY +
      FixedPointMath.toNumber(pool.balanceX, pool.decimalsX) * priceX
    );

  return 0;
};
