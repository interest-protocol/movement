import { Box } from '@interest-protocol/ui-kit';
import { FC } from 'react';
import { v4 } from 'uuid';

import Layout from '@/components/layout';

import Input from './input';
import ManageSlippage from './manage-slippage';
import SwapFlipToken from './swap-flip-token';
import SwapManager from './swap-manager';
import SwapPath from './swap-manager/swap-path';
import SwapPreviewButton from './swap-preview-button';
import SwapUpdatePrice from './swap-update-price';

const Swap: FC = () => {
  return (
    <Layout title="Swap">
      <Box
        mx="auto"
        display="flex"
        borderRadius="2xl"
        flexDirection="column"
        px={['xl', 'xl', 'xl', '7xl']}
        width={['100%', '100%', '100%', '39.75rem']}
      >
        <Box py="xl" px="m" my="xs" borderRadius="xs" bg="container">
          <Input label="from" />
          <Box
            display="flex"
            position="relative"
            alignContent="center"
            justifyContent="center"
          >
            <Box width="100%" height="0.313rem" bg="lowContainer" />
            <Box
              gap="s"
              my="-1.5rem"
              width="100%"
              display="flex"
              position="absolute"
              alignItems="center"
              justifyContent="center"
            >
              {[
                <SwapFlipToken key={v4()} />,
                <SwapUpdatePrice key={v4()} />,
              ].map((button) => (
                <Box
                  key={v4()}
                  display="flex"
                  width="3.25rem"
                  height="3.25rem"
                  borderRadius="full"
                  border="5px solid"
                  alignItems="center"
                  borderColor="lowContainer"
                  justifyContent="center"
                >
                  {button}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box py="xl" px="m" borderRadius="xs" bg="container">
          <Input label="to" />
          <Box
            mt="l"
            mb="l"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <SwapPreviewButton />
          </Box>
        </Box>
        <SwapPath />
        <Box my="xs" bg="container" borderRadius="xs">
          <ManageSlippage />
        </Box>
      </Box>
      <SwapManager />
    </Layout>
  );
};

export default Swap;
