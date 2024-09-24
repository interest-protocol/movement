import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { SUI_TYPE_ARG } from '@mysten/sui.js/utils';
import { normalizeStructTag } from '@mysten/sui.js/utils';
import BigNumber from 'bignumber.js';
import { FC } from 'react';
import useSWR from 'swr';

import { useNetwork } from '@/context/network';
import { useCoins } from '@/hooks/use-coins';
import { CoinMetadataWithType } from '@/interface';
import { fetchCoinMetadata, isSui, makeSWRKey } from '@/utils';

import { CoinsMap } from './coins-manager.types';

const CoinsManager: FC = () => {
  const network = useNetwork();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { id, delay, updateCoins, updateLoading, updateError } = useCoins();

  useSWR(
    makeSWRKey([id, network, currentAccount?.address], CoinsManager.name),
    async () => {
      try {
        updateError(false);
        updateLoading(true);

        if (!currentAccount?.address) {
          updateCoins({} as CoinsMap);
          return;
        }

        const coinsRaw = await suiClient.getAllBalances({
          owner: currentAccount.address,
        });

        if (!coinsRaw.length) {
          updateCoins({} as CoinsMap);
          return;
        }

        const coinsType = [
          ...new Set(coinsRaw.map(({ coinType }) => coinType)),
        ];

        const dbCoinsMetadata: Record<string, CoinMetadataWithType> =
          await fetchCoinMetadata({ types: coinsType, network }).then(
            (data: ReadonlyArray<CoinMetadataWithType>) =>
              data.reduce(
                (acc, item) => ({
                  ...acc,
                  [normalizeStructTag(item.type)]: {
                    ...item,
                    type: normalizeStructTag(item.type),
                  },
                }),
                {}
              )
          );

        const filteredCoinsRaw = coinsRaw.filter(
          ({ coinType }) => dbCoinsMetadata[normalizeStructTag(coinType)]
        );

        if (!filteredCoinsRaw.length) {
          updateCoins({} as CoinsMap);
          return;
        }

        const coins = filteredCoinsRaw.reduce(
          (acc, { coinType, totalBalance, coinObjectCount }) => {
            const type = normalizeStructTag(coinType) as `0x${string}`;
            const { symbol, decimals, ...metadata } = dbCoinsMetadata[type];

            if (isSui(type))
              return {
                ...acc,
                [SUI_TYPE_ARG as `0x${string}`]: {
                  decimals,
                  metadata,
                  symbol: 'MOVE',
                  coinObjectCount,
                  balance: BigNumber(totalBalance),
                  type: SUI_TYPE_ARG as `0x${string}`,
                },
              };

            return {
              ...acc,
              [type]: {
                type,
                symbol,
                decimals,
                metadata,
                coinObjectCount,
                balance: BigNumber(totalBalance),
              },
            };
          },
          {} as CoinsMap
        ) as unknown as CoinsMap;

        updateCoins(coins);
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
