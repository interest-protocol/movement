import { Box, Typography } from '@interest-protocol/ui-kit';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { useWeb3 } from '@/hooks';
import { FixedPointMath } from '@/lib';
import { SubtractBoxSVG } from '@/svg';
import { ZERO_BIG_NUMBER } from '@/utils';

import { SwapForm } from '../swap.types';
import { InputProps } from './input.types';

const Balance: FC<InputProps> = ({ label }) => {
  const { coinsMap } = useWeb3();
  const { control } = useFormContext<SwapForm>();

  const type = useWatch({ control, name: `${label}.type` });
  const decimals = useWatch({ control, name: `${label}.decimals` });
  const symbol = useWatch({ control, name: `${label}.symbol` });

  const balance = FixedPointMath.toNumber(
    coinsMap[type]?.balance ?? ZERO_BIG_NUMBER,
    coinsMap[type]?.decimals ?? decimals
  );

  return (
    <Box display="flex" color="outline" gap="0.5rem" alignItems="center">
      <Box width="1rem" height="1rem">
        <SubtractBoxSVG
          maxHeight="100%"
          maxWidth="100%"
          width="100%"
          height="100%"
        />
      </Box>
      <Typography size="small" variant="body" fontSize="s">
        {symbol ? `${balance} ${symbol}` : '0'}
      </Typography>
    </Box>
  );
};

export default Balance;
