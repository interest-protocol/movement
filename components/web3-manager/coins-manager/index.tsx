import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { SUI_TYPE_ARG } from '@mysten/sui.js/utils';
import { normalizeStructTag } from '@mysten/sui.js/utils';
import BigNumber from 'bignumber.js';
import { values } from 'ramda';
import { FC } from 'react';
import useSWR from 'swr';

import { useNetwork } from '@/context/network';
import { useCoins } from '@/hooks/use-coins';
import { CoinMetadataWithType } from '@/interface';
import { fetchCoinMetadata, isSui, makeSWRKey, ZERO_BIG_NUMBER } from '@/utils';

import { CoinsMap, TGetAllCoins } from './coins-manager.types';

const getAllCoins: TGetAllCoins = async (
  provider,
  account,
  updateCoins,
  set,
  network,
  cursor = null
) => {
  const {
    data: coinsRaw,
    nextCursor,
    hasNextPage,
  } = await provider.getAllCoins({
    owner: account,
    cursor,
  });

  if (!coinsRaw.length) return updateCoins({} as CoinsMap);

  const coinsType = [...new Set(coinsRaw.map(({ coinType }) => coinType))];

  fetchCoinMetadata({ types: coinsType, network }).then(
    (data: ReadonlyArray<CoinMetadataWithType>) => {
      const dbCoinsMetadata: Record<string, CoinMetadataWithType> = data.reduce(
        (acc, item) => ({
          ...acc,
          [normalizeStructTag(item.type)]: {
            ...item,
            type: normalizeStructTag(item.type),
          },
        }),
        {}
      );

      const filteredCoinsRaw = coinsRaw.filter(
        ({ coinType }) => dbCoinsMetadata[normalizeStructTag(coinType)]
      );

      if (!filteredCoinsRaw.length) return updateCoins({} as CoinsMap);

      set(({ coinsMap: coinsMapState }) => {
        const coinsMap = filteredCoinsRaw.reduce(
          (acc, { coinType, ...coinRaw }) => {
            const type = normalizeStructTag(coinType) as `0x${string}`;
            const { symbol, decimals, ...metadata } = dbCoinsMetadata[type];

            if (isSui(type))
              return {
                ...acc,
                [SUI_TYPE_ARG as `0x${string}`]: {
                  ...acc[SUI_TYPE_ARG as `0x${string}`],
                  ...coinRaw,
                  decimals,
                  metadata,
                  symbol: 'MOVE',
                  type: SUI_TYPE_ARG as `0x${string}`,
                  balance: BigNumber(coinRaw.balance).plus(
                    acc[SUI_TYPE_ARG as `0x${string}`]?.balance ??
                      ZERO_BIG_NUMBER
                  ),
                  objects: (acc[SUI_TYPE_ARG as string]?.objects ?? []).concat([
                    { ...coinRaw, type: SUI_TYPE_ARG as `0x${string}` },
                  ]),
                },
              };

            return {
              ...acc,
              [type]: {
                ...acc[type],
                ...coinRaw,
                type,
                symbol,
                decimals,
                metadata,
                balance: BigNumber(coinRaw.balance).plus(
                  acc[type]?.balance ?? ZERO_BIG_NUMBER
                ),
                objects: (acc[type]?.objects ?? []).concat([
                  { ...coinRaw, type },
                ]),
              },
            };
          },
          coinsMapState
        );
        const coins = values(coinsMap);

        return { coins, coinsMap };
      });
    }
  );

  if (!hasNextPage) return;

  return getAllCoins(provider, account, updateCoins, set, network, nextCursor);
};

const CoinsManager: FC = () => {
  const network = useNetwork();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { id, delay, set, updateCoins, updateLoading, updateError } =
    useCoins();

  useSWR(
    makeSWRKey([id, network, currentAccount?.address], CoinsManager.name),
    async () => {
      try {
        updateError(false);
        updateLoading(true);
        updateCoins({} as CoinsMap);

        if (!currentAccount?.address) return;

        await getAllCoins(
          suiClient,
          currentAccount.address,
          updateCoins,
          set,
          network
        );
      } catch {
        updateError(true);
      } finally {
        updateLoading(false);
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshWhenHidden: false,
      refreshInterval: delay,
    }
  );

  return null;
};

export default CoinsManager;
