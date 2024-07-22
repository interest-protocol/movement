import { MoveObjectArgument } from '@interest-protocol/clamm-sdk';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { normalizeSuiAddress } from '@mysten/sui.js/utils';

import { useClammSdk } from '@/hooks/use-clamm-sdk';
import { useWeb3 } from '@/hooks/use-web3';
import { FixedPointMath } from '@/lib';
import { getLpCoinBytecode } from '@/lib/move-template/lp-coin';
import initMoveByteCodeTemplate from '@/lib/move-template/move-bytecode-template';
import { isSui } from '@/utils';

import { Token } from './pool-create.types';

export const useCreateLpCoin = () => {
  const currentAccount = useCurrentAccount();

  return async (tokens: ReadonlyArray<Token>) => {
    if (!currentAccount) throw new Error('No account');

    const info = {
      decimals: 9,
      totalSupply: 0n,
      recipient: currentAccount.address,
      imageUrl: 'https://www.interestprotocol.com/logo.png',
      name: `i${tokens.reduce(
        (acc, { symbol }) => `${acc ? `${acc}/` : ''}${symbol.toUpperCase()}`,
        ''
      )}`,
      symbol: `ipx-s-${tokens.reduce(
        (acc, { symbol }) => `${acc ? `${acc}-` : ''}${symbol.toLowerCase()}`,
        ''
      )}`,
      description: `CLAMM Interest Protocol LpCoin for ${tokens.reduce(
        (acc, { symbol }) => `${acc ? `${acc}/` : ''}${symbol.toUpperCase()}`,
        ''
      )}`,
    };

    await initMoveByteCodeTemplate('/move_bytecode_template_bg.wasm');

    const txb = new TransactionBlock();

    const [upgradeCap] = txb.publish({
      modules: [[...getLpCoinBytecode(info)]],
      dependencies: [normalizeSuiAddress('0x1'), normalizeSuiAddress('0x2')],
    });

    txb.transferObjects([upgradeCap], txb.pure.address(currentAccount.address));

    return txb;
  };
};

export const useCreateStablePool = () => {
  const clamm = useClammSdk();
  const { coinsMap } = useWeb3();
  const currentAccount = useCurrentAccount();

  return async (
    tokens: ReadonlyArray<Token>,
    treasuryCap: string | null | undefined,
    coinType: string
  ): Promise<TransactionBlock> => {
    if (!currentAccount) throw new Error('No account');

    if (!treasuryCap) throw new Error('No authorization to use this LP coin');

    const auxTxb = new TransactionBlock();

    const coins = tokens.map(({ type, value }) => {
      const [firstCoin, ...otherCoins] = coinsMap[type].objects;

      const firstCoinObject = auxTxb.object(firstCoin.coinObjectId);

      if (otherCoins.length)
        auxTxb.mergeCoins(
          firstCoinObject,
          otherCoins.map((coin) => coin.coinObjectId)
        );

      const [splittedCoin] = auxTxb.splitCoins(firstCoinObject, [
        auxTxb.pure.u64(
          FixedPointMath.toBigNumber(value, coinsMap[type].decimals)
            .decimalPlaces(0)
            .toString()
        ),
      ]);

      return splittedCoin;
    });

    const typeArguments = [...tokens.map((token) => token.type), coinType];

    const { pool, poolAdmin, lpCoin, tx } = await clamm.newStable({
      tx: auxTxb as any,
      lpCoinTreasuryCap: treasuryCap,
      typeArguments: typeArguments,
      coins: coins as unknown as MoveObjectArgument[],
    });

    tx.transferObjects(
      [poolAdmin, lpCoin],
      tx.pure.address(currentAccount.address)
    );

    return clamm.shareStablePool({ tx, pool }) as unknown as TransactionBlock;
  };
};

export const useCreateVolatilePool = () => {
  const clamm = useClammSdk();
  const { coinsMap } = useWeb3();
  const currentAccount = useCurrentAccount();

  return async (
    tokens: ReadonlyArray<Token>,
    treasuryCap: string | null | undefined,
    lpCoinType: string
  ): Promise<TransactionBlock> => {
    if (!currentAccount) throw new Error('No account');

    if (!treasuryCap) throw new Error('No authorization to use this LP coin');

    const auxTxb = new TransactionBlock();

    const coins = tokens.map(({ type, value }) => {
      if (isSui(type))
        return auxTxb.splitCoins(auxTxb.gas, [
          auxTxb.pure.u64(
            FixedPointMath.toBigNumber(value, coinsMap[type].decimals)
              .decimalPlaces(0)
              .toString()
          ),
        ])[0];

      const [firstCoin, ...otherCoins] = coinsMap[type].objects;

      const firstCoinObject = auxTxb.object(firstCoin.coinObjectId);

      if (otherCoins.length)
        auxTxb.mergeCoins(
          firstCoinObject,
          otherCoins.map((coin) => coin.coinObjectId)
        );

      const [splittedCoin] = auxTxb.splitCoins(firstCoinObject, [
        auxTxb.pure.u64(
          FixedPointMath.toBigNumber(value, coinsMap[type].decimals)
            .decimalPlaces(0)
            .toString()
        ),
      ]);

      return splittedCoin;
    });

    const typeArguments = [...tokens.map((token) => token.type), lpCoinType];

    const PRECISION = 18;

    const price = BigInt(
      FixedPointMath.toBigNumber(+tokens[0].value / +tokens[1].value, PRECISION)
        .decimalPlaces(0)
        .toFixed(0)
    );

    const { pool, poolAdmin, lpCoin, tx } = await clamm.newVolatile({
      coins: coins as unknown as MoveObjectArgument[],
      tx: auxTxb as any,
      lpCoinTreasuryCap: treasuryCap,
      typeArguments: typeArguments,
      prices: [price],
    });

    tx.transferObjects(
      [poolAdmin, lpCoin],
      tx.pure.address(currentAccount.address)
    );

    return clamm.shareVolatilePool({
      tx,
      pool,
    }) as unknown as TransactionBlock;
  };
};
