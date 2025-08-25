import { IcCheck } from '@icons';

import type { InputHTMLAttributes } from 'react';

interface CheckboxCircleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
}

const CheckboxCircle = ({ checked = false, className = '', ...props }: CheckboxCircleProps) => {
  const base = 'relative flex items-center justify-center w-[2rem] h-[2rem] rounded-full';

  const variant = {
    unchecked: 'bg-icon-neutral-disabled',
    checked: 'bg-mint-50',
  };

  const currentVariant = checked ? variant.checked : variant.unchecked;

  return (
    <div className={`${base} ${currentVariant} ${className}`}>
      <input
        type='checkbox'
        checked={checked}
        className='absolute inset-0 cursor-pointer opacity-0'
        {...props}
      />
      <IcCheck className='pointer-events-none h-[2rem] w-[2rem] [&_path]:stroke-white' />
    </div>
  );
};

export default CheckboxCircle;
