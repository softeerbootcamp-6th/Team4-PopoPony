import { IcSpinner } from '@icons';

interface Props {
  size?: string;
  color?: 'black' | 'white' | 'primary';
  isLoading?: boolean;
  className?: string;
}

const Spinner = ({ size = '24', color = 'black', isLoading = false, className }: Props) => {
  const colorStyle = {
    black: '[&_path]:fill-neutral-90',
    white: '[&_path]:fill-neutral-0',
    primary: '[&_path]:fill-mint-50',
  };

  return (
    <div
      className={`animate-spin items-center justify-center ${isLoading ? 'flex' : 'hidden'} ${className}`}>
      <IcSpinner
        className={`${colorStyle[color]} [&_path]:fill-opacity-1`}
        width={size}
        height={size}
      />
    </div>
  );
};

export default Spinner;
