import { CLAMM as CLAMM_ } from '@interest-protocol/clamm-sdk';
import { SuiClient } from '@mysten/sui/client';

import { Network, RPC_URL } from '@/constants';

export const testnetClient = new SuiClient({
  url: RPC_URL[Network.TESTNET],
});
export const devnetClient = new SuiClient({
  url: RPC_URL[Network.DEVNET],
});

export const suiClientRecord = {
  [Network.DEVNET]: devnetClient,
  [Network.TESTNET]: testnetClient,
} as Record<Network, SuiClient>;

export const CLAMM = new CLAMM_({
  suiClient: devnetClient as any,
  network: 'devnet',
});
