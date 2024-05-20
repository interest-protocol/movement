import { FC } from 'react';

import { SVGProps } from './svg.types';

const Refresh: FC<SVGProps> = ({ maxWidth, maxHeight, ...props }) => (
  <svg
    style={{ maxWidth, maxHeight }}
    viewBox="0 0 22 22"
    fill="none"
    {...props}
  >
    <path
      d="M11 2C6.02944 2 2 6.02944 2 11V12H0V11C0 4.92487 4.92487 0 11 0C14.7216 0 18.01 1.84804 20 4.67419V1H22V8H15V6H18.4847C16.8694 3.58695 14.1193 2 11 2Z"
      fill="currentColor"
    />
    <path
      d="M21.9999 10V11C21.9999 17.0751 17.0751 22 10.9999 22C7.27841 22 3.99001 20.152 2 17.3259V21H0V14H7V16H3.51525C5.1305 18.413 7.88069 20 10.9999 20C15.9705 20 19.9999 15.9706 19.9999 11V10H21.9999Z"
      fill="currentColor"
    />
  </svg>
);

export default Refresh;
