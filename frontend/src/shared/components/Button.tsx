import type { ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'assistive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
  width?: string;
}

const Button = ({
  disabled = false,
  variant = 'primary',
  size = 'lg',
  isLoading,
  className = '',
  children,
  width,
  ...props
}: ButtonProps) => {
  const baseStyle = width
    ? `w-[${width}] flex-center focus:outline-none`
    : `w-full flex-center focus:outline-none`;

  const variantStyle = {
    primary: 'bg-mint-50 text-neutral-0',
    secondary: 'bg-neutral-10 text-neutral-90',
    assistive: 'bg-neutral-0 text-neutral-90 border border-stroke-neutral-dark',
  };

  const disabledVariantStyle = {
    primary: 'bg-neutral-20 text-neutral-40',
    secondary: 'bg-neutral-10 text-neutral-40',
    assistive: 'bg-neutral-20 text-neutral-40',
  };

  const sizeStyle = {
    sm: 'label2-14-bold h-[3.1rem] rounded-[0.4rem]',
    md: 'body1-16-bold h-[4.8rem] rounded-[0.4rem]',
    lg: 'subtitle-18-bold h-[5.6rem] rounded-[0.6rem]',
  };

  const spinnerSize = {
    sm: '16',
    md: '24',
    lg: '24',
  };

  const spinnerColor: Record<'primary' | 'secondary' | 'assistive', 'white' | 'black'> = {
    primary: 'white',
    secondary: 'black',
    assistive: 'black',
  };

  return (
    <button
      type='button'
      disabled={disabled}
      className={`${className} ${baseStyle} ${disabled ? disabledVariantStyle[variant] : variantStyle[variant]} ${sizeStyle[size]}`}
      {...props}>
      <Spinner size={spinnerSize[size]} color={spinnerColor[variant]} isLoading={isLoading} />
      {!isLoading && <>{children}</>}
    </button>
  );
};

export default Button;
