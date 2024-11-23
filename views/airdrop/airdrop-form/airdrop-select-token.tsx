import { Box, Motion, Typography } from '@interest-protocol/ui-kit';
import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { TokenIcon } from '@/components';
import { CoinObject } from '@/components/web3-manager/coins-manager/coins-manager.types';
import { PRICE_TYPE } from '@/constants';
import { useNetwork } from '@/context/network';
import useGetMultipleTokenPriceByType from '@/hooks/use-get-multiple-token-price-by-type';
import { useModal } from '@/hooks/use-modal';
import { CoinData } from '@/interface';
import { ChevronRightSVG } from '@/svg';

import SelectTokenModal from '../../components/select-token-modal';
import { IAirdropForm } from '../airdrop.types';

const BOX_ID = 'dropdown-id';

const AirdropSelectToken: FC = () => {
  const network = useNetwork();
  const { setModal, handleClose } = useModal();
  const { control, setValue } = useFormContext<IAirdropForm>();
  const token = useWatch({ control, name: 'token' });

  const {
    isLoading,
    error,
    data: usdPrice,
  } = useGetMultipleTokenPriceByType(
    PRICE_TYPE[token?.symbol] ? [PRICE_TYPE[token?.symbol]] : []
  );

  useEffect(() => {
    if (!isLoading && !error)
      setValue(
        'tokenUSDPrice',
        PRICE_TYPE[token?.symbol] ? usdPrice?.[PRICE_TYPE[token?.symbol]] : 0
      );
  }, [usdPrice, isLoading, error]);

  const onSelect = (coin: CoinData) => {
    setValue('token', coin as CoinObject);
    setValue('tokenUSDPrice', undefined);
  };

  const openModal = () =>
    setModal(
      <Motion
        animate={{ scale: 1 }}
        initial={{ scale: 0.85 }}
        transition={{ duration: 0.3 }}
      >
        <SelectTokenModal closeModal={handleClose} onSelect={onSelect} />
      </Motion>,
      {
        custom: true,
        allowClose: true,
      }
    );

  return (
    <Box position="relative" id={BOX_ID}>
      <Box
        p="xs"
        gap="xs"
        display="flex"
        minWidth="8rem"
        cursor="pointer"
        borderRadius="xs"
        border="1px solid"
        alignItems="center"
        onClick={openModal}
        borderColor="outlineVariant"
      >
        {token && (
          <TokenIcon
            withBg
            type={token.type}
            network={network}
            symbol={token.symbol}
          />
        )}
        <Typography variant="label" size="large" flex="1" as="span">
          {token ? token.symbol : '---'}
        </Typography>
        <Box rotate="90deg">
          <ChevronRightSVG maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />
        </Box>
      </Box>
    </Box>
  );
};

export default AirdropSelectToken;
