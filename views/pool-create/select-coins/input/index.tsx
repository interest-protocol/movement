import { Box, TextField } from '@interest-protocol/ui-kit';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { parseInputEventToNumberString } from '@/utils';

import { CreatePoolForm } from '../../pool-create.types';
import HeaderInfo from './header-info';
import { InputProps } from './input.types';
import InputMaxButton from './input-max-button';
import SelectToken from './select-token';

const Input: FC<InputProps> = ({ index }) => {
  const { control, register, setValue } = useFormContext<CreatePoolForm>();
  const display = useWatch({ control, name: `tokens.${index}.value` });
  const editable = useWatch({ control, name: `tokens.${index}.value` });

  console.log('Display data :: ', display);
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
      <HeaderInfo index={index} />
      <SelectToken index={index} />
      <Box
        display="flex"
        alignItems="flex-end"
        flexDirection="column"
        justifyContent="flex-end"
      >
        <TextField
          pl="-1rem"
          fontSize="2xl"
          lineHeight="l"
          placeholder="0"
          color="onSurface"
          textAlign="right"
          fontFamily="Satoshi"
          {...register(`tokens.${index}.value`, {
            onChange: (v) =>
              setValue(
                `tokens.${index}.value`,
                !editable
                  ? '1'
                  : parseInputEventToNumberString(v, Number(display))
              ),
          })}
          fieldProps={{
            mt: 'm',
            width: '100%',
            borderRadius: 'xs',
            borderColor: 'transparent',
          }}
        />
      </Box>
      <InputMaxButton index={index} />
    </Box>
  );
};

export default Input;
