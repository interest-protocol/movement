import type { FC } from 'react';

import type { SVGProps } from '@/components/svg/svg.types';

export interface AnalyticsCardProps {
  title: string;
  loading: boolean;
  quantity?: number;
  Icon: FC<SVGProps>;
}

interface ChartItem {
  x: string;
  amount: number;
  description: string;
}
export interface AnalyticsChartProps {
  title: string;
  loading: boolean;
  data: ReadonlyArray<ChartItem>;
}
