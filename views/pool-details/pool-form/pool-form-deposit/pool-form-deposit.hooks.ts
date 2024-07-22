import { MoveObjectArgument } from '@interest-protocol/clamm-sdk';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import invariant from 'tiny-invariant';

import { useClammSdk } from '@/hooks/use-clamm-sdk';
import { useWeb3 } from '@/hooks/use-web3';
import { getSafeValue, isSui } from '@/utils';
import { PoolForm } from '@/views/pools/pools.types';

export const useDeposit = () => {
  const clamm = useClammSdk();
  const { coinsMap } = useWeb3();
  const currentAccount = useCurrentAccount();

  return async (values: PoolForm): Promise<TransactionBlock> => {
    const { tokenList, pool, settings } = values;

    invariant(currentAccount, 'Must to connect your wallet');
    invariant(tokenList.length, 'No tokens ');

    const initTx = new TransactionBlock();

    const coins = tokenList.map(({ value, type }) => {
      if (!+value) {
        const coinZero = initTx.moveCall({
          target: `0x2::coin::zero`,
          typeArguments: [type],
        });

        return coinZero;
      }

      const safeValue = getSafeValue({
        coinValue: value,
        coinType: type,
        balance: coinsMap[type].balance,
        decimals: coinsMap[type].decimals,
      });

      if (isSui(type)) {
        const [splittedCoin] = initTx.splitCoins(initTx.gas, [
          initTx.pure.u64(safeValue.toString()),
        ]);

        return splittedCoin;
      }

      const [firstCoin, ...otherCoins] = coinsMap[type].objects;

      const firstCoinObject = initTx.object(firstCoin.coinObjectId);

      if (otherCoins.length)
        initTx.mergeCoins(
          firstCoinObject,
          otherCoins.map((coin) => coin.coinObjectId)
        );

      const [splittedCoin] = initTx.splitCoins(firstCoinObject, [
        initTx.pure.u64(safeValue.toString()),
      ]);

      return splittedCoin;
    });

    const { lpCoin, tx } = await clamm.addLiquidity({
      coinsIn: coins as unknown as MoveObjectArgument[],
      tx: initTx as any,
      pool: pool.poolObjectId,
      slippage: +settings.slippage,
    });

    tx.transferObjects([lpCoin], tx.pure.address(currentAccount.address));

    return tx as unknown as TransactionBlock;
  };
};
