import { MoveObjectArgument } from '@interest-protocol/clamm-sdk';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import {
  TransactionBlock,
  TransactionObjectArgument,
} from '@mysten/sui.js/transactions';

import { useClammSdk } from '@/hooks/use-clamm-sdk';
import { useWeb3 } from '@/hooks/use-web3';
import { getCoinOfValue, getSafeValue } from '@/utils';
import { PoolForm } from '@/views/pools/pools.types';

export const useWithdraw = () => {
  const clamm = useClammSdk();
  const { coinsMap } = useWeb3();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  return async (values: PoolForm): Promise<TransactionBlock> => {
    const { tokenList, pool, lpCoin: coin, tokenSelected } = values;

    if (!+coin.value || !tokenList.length) throw new Error('No tokens ');

    if (!currentAccount) throw new Error('No account found');

    const lpCoinWallet = coinsMap[coin.type];

    if (!lpCoinWallet) throw new Error('Check the wallet Lp coins');

    const initTxb = new TransactionBlock();

    const coinValue = getSafeValue({
      coinValue: coin.value,
      coinType: coin.type,
      balance: lpCoinWallet.balance,
      decimals: lpCoinWallet.decimals,
    }).toString();

    const lpCoin = await getCoinOfValue({
      suiClient,
      coinValue,
      txb: initTxb,
      coinType: coin.type,
      account: currentAccount.address,
    });

    let coinsOut = [];
    let txb: TransactionBlock;

    if (tokenSelected) {
      const response = await clamm.removeLiquidityOneCoin({
        tx: initTxb as any,
        pool: pool.poolObjectId,
        coinOutType: tokenSelected,
        lpCoin: lpCoin as unknown as MoveObjectArgument,
      });

      txb = response.tx as unknown as TransactionBlock;

      coinsOut = [response.coinOut] as unknown as TransactionObjectArgument[];
    } else {
      const response = await clamm.removeLiquidity({
        lpCoin: lpCoin as unknown as MoveObjectArgument,
        tx: initTxb as any,
        pool: pool.poolObjectId,
      });

      txb = response.tx as unknown as TransactionBlock;

      coinsOut = response.coinsOut as unknown as TransactionObjectArgument[];
    }

    txb.transferObjects(coinsOut, txb.pure.address(currentAccount.address));

    return txb;
  };
};
