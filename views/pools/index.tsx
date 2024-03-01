import { Box } from '@interest-protocol/ui-kit';
import { FC, useState } from 'react';
import { v4 } from 'uuid';

import Layout from '@/components/layout';
import { RECOMMENDED_POOLS } from '@/constants/pools';
import { useNetwork } from '@/context/network';

import Header from './header';
import PoolCard from './pool-card';
import PoolFilter from './pool-filter';
import { PoolTabEnum } from './pools.types';

const Pools: FC = () => {
  const { network } = useNetwork();

  const [tab, setTab] = useState<PoolTabEnum>(PoolTabEnum.Pools);

  return (
    <Layout title="Pools">
      <Box mx={['0', '0', '0', '0', '2xl']}>
        <Box py="xl">
          <Header setTab={setTab} currentTab={tab} />
        </Box>
        <Box
          gap="2xs"
          bg="container"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          flexDirection="column"
          borderRadius="xs"
          p={['s', 's', 's', 'l']}
        >
          <PoolFilter />
          <Box
            gap="m"
            display="grid"
            borderRadius="xs"
            p={['s', 's', 's', 'l']}
            gridTemplateColumns={['1fr', '1fr', '1fr 1fr', '1fr 1fr 1fr']}
          >
            {RECOMMENDED_POOLS[network].map((pool) => (
              <PoolCard key={v4()} {...pool} />
            ))}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Pools;
