import { Box } from '@interest-protocol/ui-kit';
import Link from 'next/link';
import { FC } from 'react';

import MenuMobile from '@/components/menu-mobile';
import Wallet from '@/components/wallet';
import { Routes, RoutesEnum } from '@/constants';
import { LogoSVG } from '@/svg';

const Header: FC = () => (
  <>
    <Box
      py="m"
      px="xl"
      top="0"
      gap="xs"
      left="0"
      right="0"
      zIndex="1"
      width="100%"
      position="relative"
      alignItems="center"
      borderBottom="1px solid"
      justifyContent="flex-end"
      borderColor="outlineVariant"
      gridTemplateColumns="1fr 1fr"
      display={['none', 'none', 'none', 'flex']}
    >
      <Wallet />
    </Box>
    <Box
      py="m"
      top="0"
      gap="xs"
      zIndex={3}
      width="100%"
      position="relative"
      alignItems="center"
      bg="lowestContainer"
      px={['m', 'l', 'l', 'xl']}
      justifyContent="space-between"
      gridTemplateColumns="1fr 1fr 1fr"
      display={['flex', 'flex', 'flex', 'none']}
      boxShadow="0 1.5rem 2.875rem -0.625rem rgba(13, 16, 23, 0.16)"
    >
      <Link href={Routes[RoutesEnum.Swap]}>
        <Box
          display="flex"
          alignItems="center"
          height="1.5rem"
          color="onSurface"
        >
          <LogoSVG maxHeight="2.5rem" maxWidth="7.5rem" width="100%" isShort />
        </Box>
      </Link>
      <Box position="relative" display="flex" gap="s" alignItems="center">
        <Wallet />
        <MenuMobile />
      </Box>
    </Box>
  </>
);

export default Header;
