import { Box, TextField } from '@interest-protocol/ui-kit';
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { parseInputEventToNumberString } from '@/utils';

import useEventListener from '../../../../hooks/use-event-listener';
import { CreatePoolForm } from '../../pool-create.types';
import HeaderInfo from './header-info';
import { InputProps } from './input.types';
import InputMaxButton from './input-max-button';
import SelectToken from './select-token';

const Input: FC<InputProps> = ({ index }) => {
  const { register, setValue } = useFormContext<CreatePoolForm>();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const handleSetMobile = useCallback(() => {
    const mediaIsMobile = !window.matchMedia('(max-width: 26.875rem)').matches;
    setIsMobile(mediaIsMobile);
  }, []);

  useEventListener('resize', handleSetMobile, true);

  return (
    <Box
      display=" flex"
      flexDirection="column"
      justifyContent="center"
      alignContent="center"
    >
      <Box
        width="100%"
        display="flex"
        borderRadius="s"
        border="2px solid"
        position="relative"
        alignItems="center"
        borderColor="onSurface"
        justifyContent="space-between"
      >
        <SelectToken index={index} isMobile={isMobile} />
        <Box
          mx="2xs"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <TextField
            fontSize="2xl"
            lineHeight="l"
            placeholder="--"
            color="onSurface"
            textAlign="right"
            fontFamily="Satoshi"
            {...register(`tokens.${index}.value`, {
              onChange: (v: ChangeEvent<HTMLInputElement>) => {
                setValue?.(
                  `tokens.${index}.value`,
                  parseInputEventToNumberString(v)
                );
              },
            })}
            fieldProps={{
              width: '100%',
              borderRadius: 'xs',
              borderColor: 'transparent',
            }}
          />
        </Box>
      </Box>
      <Box
        my="xs"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <HeaderInfo index={index} isMobile={isMobile} />
        <InputMaxButton index={index} />
      </Box>
    </Box>
  );
};

export default Input;
