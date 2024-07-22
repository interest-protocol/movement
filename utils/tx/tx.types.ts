import type { useSignTransactionBlock } from '@mysten/dapp-kit';
import type { SuiClient } from '@mysten/sui.js/client';
import type { SuiTransactionBlockResponseOptions } from '@mysten/sui.js/client';
import type { TransactionBlock } from '@mysten/sui.js/transactions';
import type { WalletAccount } from '@wallet-standard/base';

export interface SignAndExecuteArgs {
  suiClient: SuiClient;
  currentAccount: WalletAccount;
  txb: TransactionBlock;
  signTransactionBlock: ReturnType<typeof useSignTransactionBlock>;
  options?: SuiTransactionBlockResponseOptions;
}

export interface WaitForTxArgs {
  suiClient: SuiClient;
  digest: string;
  timeout?: number;
  pollInterval?: number;
}
