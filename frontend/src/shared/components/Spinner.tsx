import { IcSpinner } from '@icons';

interface Props {
  size?: string;
  color?: 'black' | 'white';
}

const Spinner = ({ size = '24', color = 'black' }: Props) => {
  const colorStyle = {
    black: '[&_path]:fill-neutral-90',
    white: '[&_path]:fill-neutral-0',
  };

  return (
    <div className={`flex-center animate-spin`}>
      <IcSpinner
        className={`${colorStyle[color]} [&_path]:fill-opacity-1`}
        width={size}
        height={size}
      />
    </div>
  );
};

export default Spinner;
