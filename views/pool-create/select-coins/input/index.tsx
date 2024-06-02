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
      width="100%"
      display="flex"
      borderRadius="xs"
      border="1px solid"
      position="relative"
      alignItems="center"
      borderColor="outlineVariant"
      justifyContent="space-between"
    >
      <HeaderInfo index={index} isMobile={isMobile} />
      <SelectToken index={index} isMobile={isMobile} />
      <Box
        display="flex"
        alignItems="flex-end"
        flexDirection="column"
        justifyContent="flex-end"
      >
        <TextField
          fontSize="2xl"
          lineHeight="l"
          placeholder="0"
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
            mt: 'm',
            width: '100%',
            borderRadius: 'xs',
            borderColor: 'transparent',
          }}
        />
      </Box>

      {isMobile && <InputMaxButton index={index} />}
    </Box>
  );
};

export default Input;
