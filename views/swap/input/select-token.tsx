import { Button, Motion, Typography } from '@interest-protocol/ui-kit';
import { useSuiClientContext } from '@mysten/dapp-kit';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import TokenIcon from '@/components/token-icon';
import { Network, PRICE_TYPE } from '@/constants';
import { getPrices } from '@/hooks/use-get-multiple-token-price-by-type/use-get-multiple-token-price-by-type.utils';
import { useModal } from '@/hooks/use-modal';
import { CoinData } from '@/interface';
import { ChevronDownSVG } from '@/svg';
import { updateURL } from '@/utils';
import SelectTokenModal from '@/views/components/select-token-modal';

import { SwapForm } from '../swap.types';
import { InputProps } from './input.types';

const SelectToken: FC<InputProps> = ({ label }) => {
  const { pathname } = useRouter();
  const { network } = useSuiClientContext();
  const { setModal, handleClose } = useModal();

  const { setValue, control } = useFormContext<SwapForm>();

  const currentToken = useWatch({
    control,
    name: label,
  });

  const swapping = useWatch({
    control,
    name: 'swapping',
  });

  const { symbol: currentSymbol, type: currentType } = currentToken ?? {
    symbol: undefined,
    type: undefined,
  };

  const changeURL = (type: string, oppositeType?: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(label, type);

    if (oppositeType)
      searchParams.set(label === 'to' ? 'from' : 'to', oppositeType);

    updateURL(
      `${pathname}?from=${searchParams.get('from')}&to=${searchParams.get(
        'to'
      )}`
    );
  };

  const oppositeType = useWatch({
    control,
    name: `${label === 'to' ? 'from' : 'to'}.type`,
  });

  const onSelect = async ({ type, decimals, symbol }: CoinData) => {
    if (type === oppositeType) {
      setValue(label === 'to' ? 'from' : 'to', {
        type: currentToken.type,
        symbol: currentToken.symbol,
        decimals: currentToken.decimals,
        usdPrice: currentToken.usdPrice,
        value: '',
      });
    }

    setValue(label, {
      type,
      symbol,
      decimals,
      value: '',
      usdPrice: null,
    });

    if (PRICE_TYPE[symbol])
      getPrices([PRICE_TYPE[symbol]])
        .then((data) => {
          console.log({ data });

          setValue(`${label}.usdPrice`, data[PRICE_TYPE[symbol]]);
        })
        .catch(() => null);

    if (label === 'from') setValue('to.value', '');

    changeURL(type, type === oppositeType ? currentToken.type : undefined);
    setValue('lock', false);
  };

  const openModal = () =>
    !swapping &&
    setModal(
      <Motion
        animate={{ scale: 1 }}
        initial={{ scale: 0.85 }}
        transition={{ duration: 0.3 }}
      >
        <SelectTokenModal closeModal={handleClose} onSelect={onSelect} />
      </Motion>,
      {
        isOpen: true,
        custom: true,
        opaque: false,
        allowClose: true,
      }
    );

  return (
    <Button
      py="2xs"
      pr="s"
      fontSize="s"
      variant="tonal"
      color="onSurface"
      border="1px solid"
      borderRadius="full"
      disabled={swapping}
      onClick={openModal}
      bg="highestContainer"
      opacity={swapping ? 0.7 : 1}
      pl={currentType ? '2xs' : 'm'}
      borderColor="#C6C6CA !important"
      {...(currentType && {
        PrefixIcon: (
          <TokenIcon
            withBg
            rounded
            size="1.1rem"
            type={currentType}
            symbol={currentSymbol}
            network={network as Network}
          />
        ),
      })}
    >
      <Typography
        size="large"
        variant="label"
        overflow="hidden"
        whiteSpace="nowrap"
        fontFamily="Satoshi"
        width={['0px', 'auto']}
        display={[currentType ? 'none' : 'block', 'block']}
      >
        {currentSymbol ?? 'Select Token'}
      </Typography>
      <ChevronDownSVG maxHeight="1rem" maxWidth="1rem" width="100%" />
    </Button>
  );
};

export default SelectToken;
