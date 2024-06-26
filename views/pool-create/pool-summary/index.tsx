import { Box, Button, Typography } from '@interest-protocol/ui-kit';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 } from 'uuid';

import { TokenIcon } from '@/components';
import { Routes, RoutesEnum } from '@/constants';
import { useNetwork } from '@/context/network';
import { CircleCheckSVG } from '@/svg';
import { formatMoney } from '@/utils';

import { CreatePoolForm } from '../pool-create.types';
import PoolSummaryButton from './pool-summary-button';

const PoolSummary: FC = () => {
  const { push } = useRouter();
  const network = useNetwork();
  const { getValues } = useFormContext<CreatePoolForm>();
  const { type, isStable, tokens } = getValues();

  return (
    <Box
      my="xl"
      p="xl"
      mx="auto"
      gap="2rem"
      bg="container"
      borderRadius="xs"
      maxWidth="27.25rem"
    >
      <Typography
        mb="3xl"
        size="large"
        variant="label"
        color="onSurface"
        textAlign="center"
      >
        Pool summary
      </Typography>
      <Box
        my="m"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" gap="s">
          <Box color="success">
            <CircleCheckSVG maxWidth="1.2rem" maxHeight="1.2rem" width="100%" />
          </Box>
          <Typography
            size="medium"
            variant="body"
            opacity={0.64}
            color="onSurface"
          >
            Pool Type
          </Typography>
        </Box>
        <Box
          px="m"
          py="xs"
          display="flex"
          borderRadius="xs"
          bg="lowContainer"
          color="onSurface"
          alignItems="center"
          justifyContent="space-between"
        >
          {type}
        </Box>
      </Box>
      <Box
        my="m"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" gap="s">
          <Box color="success">
            <CircleCheckSVG maxWidth="1.2rem" maxHeight="1.2rem" width="100%" />
          </Box>
          <Typography
            size="medium"
            variant="body"
            opacity={0.64}
            color="onSurface"
          >
            Pool Algorithm
          </Typography>
        </Box>
        <Box
          px="m"
          py="xs"
          display="flex"
          borderRadius="xs"
          bg="lowContainer"
          color="onSurface"
          alignItems="center"
          justifyContent="space-between"
        >
          {isStable ? 'Stable' : 'Volatile'}
        </Box>
      </Box>
      <Box
        my="m"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" gap="s">
          <Box color="success">
            <CircleCheckSVG maxWidth="1.2rem" maxHeight="1.2rem" width="100%" />
          </Box>
          <Typography
            size="medium"
            variant="body"
            opacity={0.64}
            color="onSurface"
          >
            Coins in Pool
          </Typography>
        </Box>
        <Box
          px="m"
          py="xs"
          display="flex"
          borderRadius="xs"
          bg="lowContainer"
          color="onSurface"
          alignItems="center"
          justifyContent="space-between"
        >
          {tokens?.length}
        </Box>
      </Box>
      <Box
        p="s"
        gap="s"
        display="flex"
        bg="lowContainer"
        color="onSurface"
        borderRadius="xs"
        flexDirection="column"
      >
        {tokens?.map(({ symbol, value }) => (
          <Box
            key={v4()}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap="s">
              <Box
                display="flex"
                width="2.5rem"
                height="2.5rem"
                borderRadius="xs"
                alignItems="center"
                bg="lowestContainer"
                justifyContent="center"
              >
                <TokenIcon symbol={symbol} type={type} network={network} />
              </Box>
              <Typography variant="body" size="medium">
                {symbol}
              </Typography>
            </Box>
            <Box>{formatMoney(Number(value))}</Box>
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" gap="s" mt="xl">
        <Button
          color="onSurface"
          variant="outline"
          borderColor="outlineVariant"
          onClick={() => push(Routes[RoutesEnum.Pools])}
        >
          Cancel
        </Button>
        <PoolSummaryButton />
      </Box>
    </Box>
  );
};

export default PoolSummary;
