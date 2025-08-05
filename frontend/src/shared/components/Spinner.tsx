import { IcSpinner } from '@icons';

interface Props {
  size?: string;
  color?: 'black' | 'white';
  isLoading?: boolean;
}

const Spinner = ({ size = '24', color = 'black', isLoading = false }: Props) => {
  const colorStyle = {
    black: '[&_path]:fill-neutral-90',
    white: '[&_path]:fill-neutral-0',
  };

  return (
    <div className={`animate-spin items-center justify-center ${isLoading ? 'flex' : 'hidden'}`}>
      <IcSpinner
        className={`${colorStyle[color]} [&_path]:fill-opacity-1`}
        width={size}
        height={size}
      />
    </div>
  );
};

export default Spinner;
