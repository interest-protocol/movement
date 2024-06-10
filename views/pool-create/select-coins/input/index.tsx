import { Box } from '@interest-protocol/ui-kit';
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { parseInputEventToNumberString } from '@/utils';
import { TokenField } from '@/views/pool-create/select-coins/input/token-field';

import useEventListener from '../../../../hooks/use-event-listener';
import { CreatePoolForm } from '../../pool-create.types';
import HeaderInfo from './balance';
import Balance from './balance';
import FormInputDollar from './form-input-dollar';
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
      display=" flex"
      flexDirection="column"
      justifyContent="center"
      alignContent="center"
    >
      <TokenField
        active
        opacity="0.7"
        placeholder="--"
        variant="outline"
        textAlign="right"
        status="none"
        Bottom={<FormInputDollar index={1} />}
        {...register(`tokens.${index}.value`, {
          onChange: (v: ChangeEvent<HTMLInputElement>) => {
            setValue?.(
              `tokens.${index}.value`,
              parseInputEventToNumberString(v)
            );
          },
        })}
        Balance={<Balance index={index} />}
        ButtonMax={<InputMaxButton index={index} />}
        TokenIcon={<SelectToken index={index} isMobile={isMobile} />}
      />
    </Box>
  );

  return (
    <Box
      width="100%"
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
      ></Box>
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
