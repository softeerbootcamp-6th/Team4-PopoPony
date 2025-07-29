import type { ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'assistive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = ({
  disabled = false,
  variant = 'primary',
  size = 'lg',
  isLoading,
  children,
  ...props
}: Props) => {
  const baseStyle = `w-full flex-center`;

  const variantStyle = {
    primary: 'bg-mint-50 text-neutral-0',
    secondary: 'bg-neutral-10 text-neutral-90',
    assistive: 'bg-neutral-0 text-neutral-90',
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
      className={`${baseStyle} ${disabled ? disabledVariantStyle[variant] : variantStyle[variant]} ${sizeStyle[size]}`}
      {...props}>
      {isLoading ? (
        <Spinner size={spinnerSize[size]} color={spinnerColor[variant]} />
      ) : (
        <div>{children}</div>
      )}
    </button>
  );
};

export default Button;
