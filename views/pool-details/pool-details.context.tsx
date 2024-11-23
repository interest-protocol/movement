import { createContext, FC, PropsWithChildren, useContext } from 'react';

import { PRICE_TYPE } from '@/constants';
import { useNetwork } from '@/context/network';
import { useGetCoinMetadata } from '@/hooks/use-get-coin-metadata';
import useGetMultipleTokenPriceByType from '@/hooks/use-get-multiple-token-price-by-type';
import { usePool } from '@/hooks/use-pools';
import { AmmPool, CoinMetadataWithType } from '@/interface';

import { getAllSymbols } from '../pools/pools.utils';

interface PoolDetailsProviderProps {
  objectId: string;
}

interface PoolDetailsContext {
  loading: boolean;
  pool: AmmPool | null | undefined;
  prices: Record<string, number> | undefined;
  metadata: Record<string, CoinMetadataWithType> | undefined;
}

const INITIAL: PoolDetailsContext = {
  pool: null,
  loading: true,
  prices: undefined,
  metadata: undefined,
};

const poolDetailsContext = createContext<PoolDetailsContext>(INITIAL);

export const PoolDetailsProvider: FC<
  PropsWithChildren<PoolDetailsProviderProps>
> = ({ objectId, children }) => {
  const network = useNetwork();
  const { Provider } = poolDetailsContext;

  const {
    data: pool,
    error: poolError,
    isLoading: isPoolLoading,
  } = usePool(objectId);

  const {
    data: metadata,
    error: metadataError,
    isLoading: isMetadataLoading,
  } = useGetCoinMetadata(pool ? Object.values(pool.coinTypes) : []);

  const types = pool ? [pool.coinTypes.coinX, pool.coinTypes.coinY] : [];

  const {
    data: prices,
    isLoading: isPricesLoading,
    error: pricesError,
  } = useGetMultipleTokenPriceByType(
    getAllSymbols(types, network).flatMap((symbol) =>
      PRICE_TYPE[symbol] ? [symbol] : []
    )
  );

  const loading =
    isPoolLoading ||
    (!pool && !poolError) ||
    isMetadataLoading ||
    (!metadata && !metadataError) ||
    isPricesLoading ||
    (!prices && !pricesError);

  return (
    <Provider value={{ loading, pool, prices, metadata }}>{children}</Provider>
  );
};

export const usePoolDetails = () => useContext(poolDetailsContext);
