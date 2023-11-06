import { Box } from '@interest-protocol/ui-kit';
import { FC } from 'react';

import Wallet from '@/components/wallet';
import { LogoSVG } from '@/svg';

import NavBar from './nav-bar';

const Header: FC = () => (
  <Box
    py="m"
    px="xl"
    display="grid"
    alignItems="center"
    borderRadius="full"
    bg="lowestContainer"
    gridTemplateColumns="1fr 1fr 1fr"
    boxShadow="0px 24px 46px -10px rgba(13, 16, 23, 0.16)"
  >
    <Box display="flex" alignItems="center" height="1.5rem">
      <LogoSVG maxHeight="100%" maxWidth="100%" height="100%" />
    </Box>
    <NavBar />
    <Wallet />
  </Box>
);

export default Header;