import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import BigNumber from 'bignumber.js';
import { useFormContext } from 'react-hook-form';

import { PACKAGES } from '@/constants';
import { useNetwork } from '@/context/network';
import { useWeb3 } from '@/hooks';
import { createObjectsParameter, getSafeValue, ZERO_BIG_NUMBER } from '@/utils';

import { SwapArgs, SwapForm } from './swap.types';
import { getAmountMinusSlippage } from './swap.utils';

export const useSwap = () => {
  const network = useNetwork();
  const { coinsMap } = useWeb3();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const formSwap = useFormContext<SwapForm>();

  return () =>
    swap({
      currentAccount,
      suiClient,
      coinsMap,
      formSwap,
      network,
    });
};

export const useZeroSwap = () => {
  const network = useNetwork();
  const { coinsMap } = useWeb3();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const formSwap = useFormContext<SwapForm>();

  return () =>
    swap({
      suiClient,
      currentAccount,
      coinsMap,
      formSwap,
      network,
      isZeroSwap: true,
    });
};

const swap = async ({
  coinsMap,
  formSwap,
  network,
  suiClient,
  currentAccount,
  isZeroSwap = false,
}: SwapArgs) => {
  const { from, to, routeWithAmount, poolsMap, settings } =
    formSwap.getValues();

  if (!poolsMap) throw new Error('Pools map is missing');

  if (!routeWithAmount.length) throw new Error('There is no market');

  if (!to.type || !from.type) throw new Error('No tokens selected');

  if (!currentAccount) throw new Error('No account');

  if (!+from.value) throw new Error('Cannot swap zero coins');

  const isMaxTrade = formSwap.getValues('maxValue');

  const fromValue = isZeroSwap ? (+from.value * 0.05).toString() : from.value;

  const walletCoin = coinsMap[from.type];

  const safeAmount = getSafeValue({
    coinValue: String(from.value),
    coinType: from.type,
    decimals: from.decimals,
    balance: walletCoin.balance,
  });

  const amount = isMaxTrade
    ? coinsMap[from.type]
      ? BigNumber(coinsMap[from.type].balance)
      : ZERO_BIG_NUMBER
    : (fromValue as BigNumber).decimalPlaces(0, BigNumber.ROUND_DOWN);

  const amountIn = safeAmount.gt(amount) ? safeAmount : amount;

  const amountOut = to.value.decimalPlaces(0, BigNumber.ROUND_DOWN);

  const minAmountOut = getAmountMinusSlippage(amountOut, settings.slippage);

  const txb = new TransactionBlock();

  const coinInList = await createObjectsParameter({
    txb,
    suiClient,
    type: from.type,
    amount: amountIn.toString(),
    account: currentAccount.address,
  });

  const coinIn = txb.moveCall({
    target: `${PACKAGES[network].UTILS}::utils::handle_coin_vector`,
    typeArguments: [from.type],
    arguments: [
      txb.makeMoveVec({ objects: coinInList }),
      txb.pure.u64(amountIn.toString()),
    ],
  });

  let assetIn = coinIn;

  const [coinsPath, idsPath] = routeWithAmount;

  idsPath.forEach((id, index) => {
    const isFirstCall = index === 0;
    const isLastCall = index + 1 === idsPath.length;
    const poolMetadata = poolsMap[id];

    if (isLastCall || (isFirstCall && isLastCall)) {
      assetIn = txb.moveCall({
        target: `${PACKAGES[network].DEX}::interest_protocol_amm::swap`,
        typeArguments: [
          coinsPath[index],
          coinsPath[index + 1],
          poolMetadata.coinTypes.lpCoin,
        ],
        arguments: [
          txb.object(id),
          assetIn,
          txb.pure.u64(minAmountOut.toString()),
        ],
      });

      return;
    }

    assetIn = txb.moveCall({
      target: `${PACKAGES[network].DEX}::interest_protocol_amm::swap`,
      typeArguments: [
        coinsPath[index],
        coinsPath[index + 1],
        poolMetadata.coinTypes.lpCoin,
      ],
      arguments: [txb.object(id), assetIn, txb.pure.u64('0')],
    });
  });

  txb.transferObjects([assetIn], txb.pure.address(currentAccount.address));

  return txb;
};
