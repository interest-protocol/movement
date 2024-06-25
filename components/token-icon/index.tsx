import { Box, ProgressIndicator } from '@interest-protocol/ui-kit';
import { FC, useState } from 'react';
import useSWR from 'swr';

import { DefaultTokenSVG } from '@/svg';
import { fetchCoinMetadata } from '@/utils';

import { TOKEN_ICONS } from './token-icon.data';
import { TokenIconProps, TypeBasedIcon } from './token-icon.types';
import { isTypeBased } from './token-icons.utils';

const TokenIcon: FC<TokenIconProps> = (props) => {
  const {
    type,
    symbol,
    withBg,
    network,
    rounded,
    size = '1.5rem',
    loaderSize = 16,
  } = {
    type: '',
    withBg: '',
    network: '',
    rounded: '',
    loaderSize: 16,
    size: '1.5rem',
    ...props,
  } as TypeBasedIcon;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const stopLoad = () => setLoading(false);
  const errorOnLoad = () => setLoadError(true);

  const TokenIcon = TOKEN_ICONS[network]?.[symbol] ?? null;

  const { data: iconSrc, isLoading } = useSWR(
    `${network}-${type}`,
    async () => {
      if (TokenIcon || !isTypeBased(props)) return null;

      const data = await fetchCoinMetadata({ type, network });

      return data.iconUrl;
    }
  );

  if (loadError)
    return (
      <Box
        bg="black"
        color="white"
        display="flex"
        overflow="hidden"
        position="relative"
        alignItems="center"
        justifyContent="center"
        width={`calc(${size} * 1.66)`}
        height={`calc(${size} * 1.66)`}
        borderRadius={rounded || !withBg ? 'full' : 'xs'}
        {...(withBg && { bg: 'onSurface', color: 'surface' })}
      >
        <DefaultTokenSVG
          width="100%"
          maxWidth={size ?? '1.5rem'}
          maxHeight={size ?? '1.5rem'}
        />
      </Box>
    );

  if (TokenIcon && typeof TokenIcon === 'string')
    return (
      <Box
        display="flex"
        position="relative"
        alignItems="center"
        justifyContent="center"
        width={`calc(${size} * 1.66)`}
        height={`calc(${size} * 1.66)`}
        borderRadius={rounded ? 'full' : 'xs'}
        {...(withBg && { bg: 'onSurface', color: 'surface' })}
      >
        <Box
          overflow="hidden"
          width={`calc(${size} * 1.66)`}
          height={`calc(${size} * 1.66)`}
          borderRadius={rounded ? 'full' : 'xs'}
        >
          {loading && (
            <Box position="absolute" top="-0.5rem" left="0.9rem">
              <ProgressIndicator size={loaderSize} variant="loading" />
            </Box>
          )}
          <img
            width="100%"
            height="100%"
            alt={symbol}
            src={TokenIcon}
            onLoad={stopLoad}
            onError={errorOnLoad}
            style={{ objectFit: 'cover', position: 'relative' }}
          />
        </Box>
      </Box>
    );

  if (TokenIcon)
    return (
      <Box
        display="flex"
        position="relative"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          display="flex"
          overflow="hidden"
          position="relative"
          alignItems="center"
          justifyContent="center"
          width={`calc(${size} * 1.66)`}
          height={`calc(${size} * 1.66)`}
          borderRadius={rounded ? 'full' : 'xs'}
          {...(withBg && { bg: 'onSurface', color: 'surface' })}
        >
          <TokenIcon
            width="100%"
            maxWidth={size ?? '1.5rem'}
            maxHeight={size ?? '1.5rem'}
          />
        </Box>
      </Box>
    );

  if (!isTypeBased(props))
    return (
      <Box
        display="flex"
        position="relative"
        alignItems="center"
        justifyContent="center"
        width={`calc(${size} * 1.66)`}
        height={`calc(${size} * 1.66)`}
        borderRadius={rounded ? 'full' : 'xs'}
      >
        <Box
          overflow="hidden"
          width={`calc(${size} * 1.66)`}
          height={`calc(${size} * 1.66)`}
          borderRadius={rounded ? 'full' : 'xs'}
        >
          {loading && (
            <Box position="absolute" top="-0.5rem" left="0.9rem">
              <ProgressIndicator size={loaderSize} variant="loading" />
            </Box>
          )}
          <img
            alt={symbol}
            width="100%"
            height="100%"
            src={props.url}
            onLoad={stopLoad}
            onError={errorOnLoad}
            style={{ objectFit: 'cover', position: 'relative' }}
          />
        </Box>
      </Box>
    );

  if (isLoading || iconSrc)
    return (
      <Box
        display="flex"
        position="relative"
        alignItems="center"
        justifyContent="center"
        width={`calc(${size} * 1.66)`}
        height={`calc(${size} * 1.66)`}
        borderRadius={rounded ? 'full' : 'xs'}
        {...(withBg && { bg: 'onSurface', color: 'surface' })}
      >
        <Box
          overflow="hidden"
          width={`calc(${size} * 1.66)`}
          height={`calc(${size} * 1.66)`}
          borderRadius={rounded ? 'full' : 'xs'}
        >
          {isLoading && (
            <Box position="absolute" top="-0.5rem" left="0.9rem">
              <ProgressIndicator size={loaderSize} variant="loading" />
            </Box>
          )}
          {iconSrc && (
            <img
              alt={symbol}
              width="100%"
              height="100%"
              src={iconSrc}
              onLoad={stopLoad}
              onError={errorOnLoad}
              style={{ objectFit: 'cover', position: 'relative' }}
            />
          )}
        </Box>
      </Box>
    );

  return (
    <Box
      bg="black"
      color="white"
      display="flex"
      overflow="hidden"
      position="relative"
      alignItems="center"
      justifyContent="center"
      width={`calc(${size} * 1.66)`}
      height={`calc(${size} * 1.66)`}
      borderRadius={rounded || !withBg ? 'full' : 'xs'}
      {...(withBg && { bg: 'onSurface', color: 'surface' })}
    >
      <DefaultTokenSVG
        width="100%"
        maxWidth={size ?? '1.5rem'}
        maxHeight={size ?? '1.5rem'}
      />
    </Box>
  );
};

export default TokenIcon;
