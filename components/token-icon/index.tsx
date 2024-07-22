import { Box, ProgressIndicator } from '@interest-protocol/ui-kit';
import { FC, useState } from 'react';
import useSWR from 'swr';

import { DefaultTokenSVG } from '@/svg';
import { fetchCoinMetadata } from '@/utils';

import { TOKEN_ICONS } from './token-icon.data';
import { TokenIconProps } from './token-icon.types';

const TokenIcon: FC<TokenIconProps> = ({
  url,
  type,
  symbol,
  withBg,
  network,
  rounded,
  size = '1.5rem',
  loaderSize = 16,
}) => {
  const TokenIcon = TOKEN_ICONS[network]?.[symbol] ?? null;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const stopLoading = () => setLoading(false);
  const onLoadError = () => setLoadError(true);

  const { data: iconSrc, isLoading } = useSWR(
    `${network}-${type}-${url}`,
    async () => {
      if (TokenIcon || url) return null;

      const data = await fetchCoinMetadata({ network, type });
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
      >
        <Box
          overflow="hidden"
          width={`calc(${size} * 1.66)`}
          height={`calc(${size} * 1.66)`}
          borderRadius={rounded ? 'full' : 'xs'}
        >
          {loading && (
            <Box position="absolute" top="-0.5rem" left="0.9rem">
              <ProgressIndicator size={16} variant="loading" />
            </Box>
          )}
          <img
            alt={symbol}
            width="100%"
            height="100%"
            src={TokenIcon}
            onLoad={stopLoading}
            onError={onLoadError}
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
          {...(withBg && { bg: 'black', color: 'white' })}
        >
          <TokenIcon
            width="100%"
            maxWidth={size ?? '1.5rem'}
            maxHeight={size ?? '1.5rem'}
          />
        </Box>
      </Box>
    );

  if (url)
    return (
      <Box
        bg="black"
        color="white"
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
            <Box
              display="flex"
              position="absolute"
              alignItems="center"
              justifyContent="center"
              width={`calc(${size} * 1.66)`}
              height={`calc(${size} * 1.66)`}
            >
              <ProgressIndicator
                size={loaderSize}
                variant="loading"
                onLoad={stopLoading}
              />
            </Box>
          )}
          <img
            src={url}
            alt={symbol}
            width="100%"
            height="100%"
            onLoad={stopLoading}
            onError={onLoadError}
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
      >
        <Box
          overflow="hidden"
          width={`calc(${size} * 1.66)`}
          height={`calc(${size} * 1.66)`}
          borderRadius={rounded ? 'full' : 'xs'}
        >
          {(isLoading || loading) && (
            <Box position="absolute" top="-0.5rem" left="0.9rem">
              <ProgressIndicator size={16} variant="loading" />
            </Box>
          )}
          {iconSrc && (
            <img
              alt={symbol}
              width="100%"
              height="100%"
              src={iconSrc}
              onLoad={stopLoading}
              onError={onLoadError}
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
