import { Routes, RoutesEnum } from '@/constants';

export const MENU_ITEMS = [
  {
    name: 'Swap',
    path: Routes[RoutesEnum.Swap],
  },
  {
    name: 'Faucet',
    path: Routes[RoutesEnum.Faucet],
  },
  {
    name: 'Airdrop',
    path: Routes[RoutesEnum.Airdrop],
  },
  {
    name: 'Create Token',
    path: Routes[RoutesEnum.CreateToken],
  },
];
