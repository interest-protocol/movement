import { Box, Typography } from '@interest-protocol/ui-kit';
import { FC, memo } from 'react';
import Skeleton from 'react-loading-skeleton';

import { formatMoney } from '@/utils';

import type { AnalyticsCardProps } from './analytics.types';

const AnalyticsCard: FC<AnalyticsCardProps> = memo(
  ({ Icon, title, loading, quantity }) => (
    <Box
      p="xl"
      gap="s"
      display="flex"
      borderRadius="xs"
      color="onSurface"
      bg="highContainer"
      flexDirection="column"
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="title" size="medium">
          {title}
        </Typography>
        <Icon maxHeight="2rem" maxWidth="2rem" width="100%" />
      </Box>
      <Typography variant="headline" size="large">
        {loading ? (
          <Skeleton width="10rem" />
        ) : quantity ? (
          <>
            <Typography as="span" size="large" variant="headline">
              {formatMoney(quantity, 0)}
            </Typography>
            <Typography
              as="span"
              size="large"
              color="outline"
              variant="label"
              display="block"
            >
              ({quantity})
            </Typography>
          </>
        ) : (
          'N/A'
        )}
      </Typography>
    </Box>
  )
);

AnalyticsCard.displayName = 'AnalyticsCard';

export default AnalyticsCard;
