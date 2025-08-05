import { type InputHTMLAttributes } from 'react';

import { cn } from '@/shared/libs/utils';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size: 'S' | 'M';
  description?: string;
}

function Input({ className, type, size = 'M', description, ...props }: InputProps) {
  const sizeStyles = {
    S: 'h-[4.4rem]',
    M: 'h-[5.1rem]',
  };

  const paddingRight = description ? 'pr-[8rem]' : 'pr-[1.6rem]';
  if (description) {
    return (
      <div className='relative'>
        <input
          type={type}
          data-slot='input'
          className={cn(
            'border-stroke-neutral-dark bg-background-default-white text-text-neutral-primary placeholder:text-text-neutral-assistive selection:bg-mint-10 selection:text-text-neutral-primary w-full min-w-0 rounded-[0.8rem] border pl-[1.6rem] transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            'focus-visible:border-stroke-mint focus-visible:ring-stroke-mint/20 focus-visible:ring-[0.3rem]',
            'aria-invalid:ring-red-10 aria-invalid:border-red-50',
            sizeStyles[size],
            paddingRight,
            className
          )}
          {...props}
        />
        <div className='text-text-neutral-assistive pointer-events-none absolute top-1/2 right-[1.6rem] -translate-y-1/2 select-none'>
          {description}
        </div>
      </div>
    );
  }

  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'border-stroke-neutral-dark bg-background-default-white text-text-neutral-primary placeholder:text-text-neutral-assistive selection:bg-mint-10 selection:text-text-neutral-primary w-full min-w-0 rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-stroke-mint focus-visible:ring-stroke-mint/20 focus-visible:ring-[0.3rem]',
        'aria-invalid:ring-red-10 aria-invalid:border-red-50',
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}

export { Input };
