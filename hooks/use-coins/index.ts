import { v4 } from 'uuid';
import { create } from 'zustand';

import { noop } from '@/utils';

import { UseCoinsResponse } from './use-coins.types';

export const useCoins = create<UseCoinsResponse>((set) => {
  const updateCoins = set;

  const updateLoading = (response: boolean) => set({ loading: response });

  const updateError = (response: boolean) => set({ error: response });

  const updateDelay = (delay: number | undefined) => set({ delay });

  const refresh = () => set({ id: v4() });

  return {
    id: v4(),
    coins: [],
    error: false,
    coinsMap: {},
    mutate: noop,
    loading: false,
    delay: 300_0000,
    set,
    refresh,
    updateDelay,
    updateCoins,
    updateError,
    updateLoading,
  };
});
