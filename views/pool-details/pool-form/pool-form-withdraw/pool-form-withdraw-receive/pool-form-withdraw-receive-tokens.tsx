import { Box, Typography } from '@interest-protocol/ui-kit';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { v4 } from 'uuid';

import { TokenIcon } from '@/components';
import { useNetwork } from '@/context/network';
import { PoolForm } from '@/views/pools/pools.types';

import { SelectionFieldValues, TokenListProps } from '../../pool-form.types';

const PoolFormWithdrawReceiveTokens: FC<TokenListProps> = ({ type }) => {
  const network = useNetwork();
  const { control } = useFormContext<PoolForm>();

  const tokenList = useWatch({ control, name: 'tokenList' });

  const isOneCoin = type === SelectionFieldValues.OneCoin;

  return (
    <Box py="xs" borderTop="2px solid" borderColor="lowestContainer">
      {tokenList.map((token) => (
        <Box
          py="m"
          px="xl"
          key={v4()}
          display="flex"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          transition="all 350ms ease-in-out"
          nHover={isOneCoin && { bg: 'lowContainer' }}
        >
          <Box display="flex" gap="xs" alignItems="center">
            {/* {isOneCoin && (
                <RadioButton defaultValue={tokenSelected === token.type} />
              )} */}
            <TokenIcon
              withBg
              type={token.type}
              network={network}
              symbol={token.symbol}
            />
            <Typography variant="body" size="large">
              {token.symbol}
            </Typography>
          </Box>
          <Typography variant="body" ml="m" size="large">
            {token.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PoolFormWithdrawReceiveTokens;
