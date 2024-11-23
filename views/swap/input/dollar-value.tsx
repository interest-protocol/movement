import { Box, Typography } from '@interest-protocol/ui-kit';
import BigNumber from 'bignumber.js';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { formatDollars } from '@/utils';

import { SwapForm } from '../swap.types';
import { InputProps } from './input.types';
import PriceImpact from './price-impact';

const AmountInDollar: FC<InputProps> = ({ label }) => {
  const { control, getValues } = useFormContext<SwapForm>();

  const value = useWatch({
    control,
    name: `${label}.value`,
  });

  const usdPrice = useWatch({
    control,
    name: `${label}.usdPrice`,
  });

  console.log({ symbol: getValues(`${label}.symbol`), usdPrice });

  if (!(usdPrice && value)) return '--';

  return (
    <Box display="flex" gap="s" alignItems="center">
      <Typography
        size="small"
        fontSize="s"
        variant="body"
        color={value ? 'outline' : 'onSurface'}
      >
        {usdPrice && value
          ? formatDollars(
              +BigNumber(value).times(BigNumber(usdPrice)).toNumber().toFixed(3)
            )
          : '--'}{' '}
      </Typography>
      {label == 'to' && <PriceImpact />}
    </Box>
  );
};

export default AmountInDollar;
