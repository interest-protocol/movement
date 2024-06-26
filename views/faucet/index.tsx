import { Typography } from '@interest-protocol/ui-kit';
import { FC } from 'react';

import Layout from '@/components/layout';

import MintBalances from './mint-balances';
import MintForm from './mint-form';

const Faucet: FC = () => (
  <Layout>
    <Typography
      my="2xl"
      size="large"
      variant="display"
      textAlign="center"
      color="onSurface"
    >
      Faucet
    </Typography>
    <MintForm />
    <MintBalances />
  </Layout>
);

export default Faucet;
