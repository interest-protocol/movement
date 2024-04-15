import { Box, RadioButton, Typography } from '@interest-protocol/ui-kit';
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 } from 'uuid';

import { useNetwork } from '@/context/network';
import { useWeb3 } from '@/hooks';
import { FixedPointMath, TOKEN_ICONS } from '@/lib';
import { DefaultTokenSVG } from '@/svg';
import { PoolForm } from '@/views/pools/pools.types';

import { SelectionFieldValues, TokenListProps } from '../pool-form.types';

const SelectionTokenList: FC<TokenListProps> = ({ type }) => {
  const network = useNetwork();
  const { coinsMap } = useWeb3();
  const { getValues } = useFormContext<PoolForm>();

  const tokenList = getValues('tokenList');

  const [tokenSelected, setTokenSelected] = useState(tokenList[0].type);

  const isOneCoin = type === SelectionFieldValues.OneCoin;

  return (
    <Box py="xs" borderTop="2px solid" borderColor="lowestContainer">
      {tokenList.map((token) => {
        const Icon = TOKEN_ICONS[network][token.symbol] ?? DefaultTokenSVG;

        return (
          <Box
            key={v4()}
            py="m"
            px="xl"
            display="flex"
            cursor="pointer"
            alignItems="center"
            justifyContent="space-between"
            transition="all 350ms ease-in-out"
            onClick={() => setTokenSelected(token.type)}
            nHover={{
              bg: 'lowContainer',
            }}
          >
            <Box display="flex" gap="xs" alignItems="center">
              {isOneCoin && (
                <RadioButton defaultValue={tokenSelected === token.type} />
              )}
              <Box
                display="flex"
                bg="onSurface"
                width="2.5rem"
                height="2.5rem"
                borderRadius="xs"
                alignItems="center"
                justifyContent="center"
                color="lowestContainer"
                ml={isOneCoin ? 's' : 'unset'}
              >
                <Icon maxHeight="1.5rem" maxWidth="1.5rem" width="100%" />
              </Box>
              <Typography variant="body" size="large">
                {token.symbol}
              </Typography>
            </Box>
            <Typography variant="body" ml="m" size="large">
              {isOneCoin
                ? token.value
                : FixedPointMath.toNumber(
                    coinsMap[token.type].balance,
                    token.decimals
                  )}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default SelectionTokenList;
