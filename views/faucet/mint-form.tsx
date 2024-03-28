import { Box, Button, ListItem, Typography } from '@interest-protocol/ui-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui.js/utils';
import { useWalletKit } from '@mysten/wallet-kit';
import { not } from 'ramda';
import { FC, useId, useState } from 'react';
import toast from 'react-hot-toast';
import { v4 } from 'uuid';

import { CONTROLLERS_MAP } from '@/constants';
import { COINS } from '@/constants/coins';
import { MINT_MODULE_NAME_MAP, PACKAGES } from '@/constants/packages';
import { useNetwork } from '@/context/network';
import { useMovementClient, useUserMintEpoch, useWeb3 } from '@/hooks';
import useClickOutsideListenerRef from '@/hooks/use-click-outside-listener-ref';
import { useSuiSystemState } from '@/hooks/use-sui-system-state';
import { TOKEN_ICONS, TOKEN_SYMBOL } from '@/lib';
import { ChevronDownSVG } from '@/svg';
import { showTXSuccessToast, throwTXIfNotSuccessful } from '@/utils';
import { requestMov } from '@/views/faucet/faucet.utils';

const MintForm: FC = () => {
  const [selected, setSelected] = useState(COINS[0]);
  const [isOpen, setIsOpen] = useState(false);
  const { network } = useNetwork();
  const client = useMovementClient();
  const { account, mutate } = useWeb3();
  const { signTransactionBlock } = useWalletKit();

  const SelectedIcon = TOKEN_ICONS[network][selected.symbol];

  const { data } = useSuiSystemState();

  const lastMintEpoch = useUserMintEpoch();

  const isSameEpoch =
    !!Number(data?.epoch) &&
    (lastMintEpoch as Record<TOKEN_SYMBOL, string>)[selected.symbol] ===
      data?.epoch;

  const handleMint = async () => {
    try {
      if (!selected) throw new Error('Token not found');
      if (!account) throw new Error('Not account found');

      const transactionBlock = new TransactionBlock();

      if (selected.type === SUI_TYPE_ARG) return requestMov(account, network);

      const minted_coin = transactionBlock.moveCall({
        target: `${PACKAGES[network].COINS}::${
          MINT_MODULE_NAME_MAP[selected.type]
        }::mint`,
        arguments: [transactionBlock.object(CONTROLLERS_MAP[selected.type])],
      });

      transactionBlock.transferObjects([minted_coin], account);

      const { transactionBlockBytes, signature } = await signTransactionBlock({
        transactionBlock,
      });

      const tx = await client.executeTransactionBlock({
        transactionBlock: transactionBlockBytes,
        signature,
        options: {
          showEffects: true,
          showEvents: false,
          showInput: false,
          showBalanceChanges: false,
          showObjectChanges: false,
        },
      });

      throwTXIfNotSuccessful(tx);
      await showTXSuccessToast(tx, network);
    } finally {
      await mutate();
    }
  };

  const boxId = useId();

  const closeDropdown = (event: any) => {
    if (
      event?.path?.some((node: any) => node?.id == boxId) ||
      event?.composedPath()?.some((node: any) => node?.id == boxId)
    )
      return;

    setIsOpen(false);
  };

  const dropdownRef = useClickOutsideListenerRef<HTMLDivElement>(closeDropdown);

  const onMint = () => {
    toast.promise(handleMint(), {
      loading: 'Loading',
      success: `${selected.symbol} minted successfully`,
      error: 'You can only mint once every 24 hours',
    });
  };

  return (
    <Box
      mb="s"
      mx="auto"
      display="flex"
      borderRadius="2rem"
      bg="lowestContainer"
      flexDirection="column"
      p={['xl', 'xl', 'xl', '7xl']}
      width={['100%', '100%', '100%', '39.75rem']}
    >
      <Typography
        size="large"
        fontSize="5xl"
        variant="title"
        fontWeight="500"
        color="onSurface"
      >
        I would like to mint...
      </Typography>
      <Box my="6xl" display="flex" gap="s" flexDirection="column">
        <Typography variant="body" size="large" color="onSurface">
          Choose coin to mint
        </Typography>
        <Box
          id={boxId}
          display="flex"
          position="relative"
          flexDirection="column"
        >
          <Button
            px="xs"
            variant="outline"
            borderRadius="xs"
            borderColor="onSurface"
            onClick={() => setIsOpen(not)}
            PrefixIcon={
              <Box
                display="flex"
                bg="onSurface"
                width="2.5rem"
                height="2.5rem"
                borderRadius="xs"
                alignItems="center"
                justifyContent="center"
              >
                <SelectedIcon
                  width="100%"
                  maxWidth="1.5rem"
                  maxHeight="1.5rem"
                />
              </Box>
            }
            SuffixIcon={
              <Box
                display="flex"
                color="onSurface"
                alignItems="center"
                justifyContent="center"
                rotate={isOpen ? '180deg' : '0deg'}
              >
                <ChevronDownSVG width="100%" maxWidth="1rem" maxHeight="1rem" />
              </Box>
            }
          >
            <Typography
              size="large"
              width="100%"
              variant="body"
              color="onSurface"
            >
              {selected.symbol}
            </Typography>
          </Button>
          {isSameEpoch && (
            <Typography variant="body" size="small" color="error" mt="xs">
              You cannot mint more {selected.symbol}
            </Typography>
          )}
          {isOpen && (
            <Box
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ref={dropdownRef}
              top="4rem"
              zIndex={1}
              cursor="pointer"
              bg="lowContainer"
              borderRadius="xs"
              border="2px solid"
              position="absolute"
              borderColor="outline"
            >
              {COINS.map(({ symbol, type, decimals }) => {
                const Icon = TOKEN_ICONS[network][symbol];
                return (
                  <ListItem
                    key={v4()}
                    title={symbol}
                    cursor="pointer"
                    onClick={() => {
                      setSelected({ symbol, type, decimals });
                      setIsOpen(false);
                    }}
                    PrefixIcon={
                      <Box
                        display="flex"
                        bg="onSurface"
                        color="surface"
                        height="1.5rem"
                        borderRadius="xs"
                        minWidth="1.5rem"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon width="100%" maxWidth="1rem" maxHeight="1rem" />
                      </Box>
                    }
                  />
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Button
          disabled={isSameEpoch}
          variant="filled"
          onClick={onMint}
          color="surface"
        >
          Mint
        </Button>
      </Box>
    </Box>
  );
};

export default MintForm;
