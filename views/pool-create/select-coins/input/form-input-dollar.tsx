import { Typography } from '@interest-protocol/ui-kit';
import { FC } from 'react';

import { InputProps } from './input.types';

const FormInputDollar: FC<InputProps> = ({ index }) => {
  console.log(index);
  /*const { control } = useFormContext<CreatePoolForm>();

  const value = useWatch({ control, name: `${index}.value` });
  const usdPrice = useWatch({ control, name: `${index}.usdPrice` });

  const usdValue = +(Number(value || 0) * (usdPrice ?? 0)).toFixed(2);*/

  return (
    <Typography
      size="small"
      variant="label"
      textAlign="right"
      color="onSurface"
    >
      {'--'} USD
    </Typography>
  );
};

export default FormInputDollar;
