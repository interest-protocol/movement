import useSWR, { SWRConfiguration } from 'swr';

import { getAllCoinsPrice } from './use-get-multiple-token-price-by-type.utils';

const useGetMultipleTokenPriceByType = (
  types: ReadonlyArray<string>,
  config: SWRConfiguration = {}
) =>
  useSWR<Record<string, number>>(
    useGetMultipleTokenPriceByType.name + types.toString(),
    async () => getAllCoinsPrice(types),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      ...config,
    }
  );

export default useGetMultipleTokenPriceByType;
