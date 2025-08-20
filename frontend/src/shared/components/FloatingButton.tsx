import { IcArrowLeft, IcCurrentLocation } from '@icons';
import { cn } from '../libs/utils';

interface Props {
  color?: 'white' | 'mint';
  icon?: 'back' | 'current';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onClick?: () => void;
}

const FloatingButton = ({
  color = 'white',
  icon = 'back',
  position = 'top-left',
  onClick,
}: Props) => {
  const colorStyle = {
    white: {
      bgColor: 'bg-background-default-white',
      iconColor: '[&_path]:fill-black',
    },
    mint: {
      bgColor: 'bg-background-default-mint',
      iconColor: '[&_path]:fill-white [&_path]:stroke-white',
    },
  };

  const positionStyle = {
    'top-left': 'top-[1.6rem] left-[1.6rem]',
    'top-right': 'top-[1.6rem] right-[1.6rem]',
    'bottom-left': 'bottom-[1.6rem] left-[1.6rem]',
    'bottom-right': 'bottom-[1.6rem] right-[1.6rem]',
  };

  const iconComponent = {
    back: <IcArrowLeft className={colorStyle[color].iconColor} />,
    current: <IcCurrentLocation className={colorStyle[color].iconColor} />,
  };

  return (
    <button
      type='button'
      className={cn(
        'shadow-button flex-center absolute z-30 h-[4.8rem] w-[4.8rem] cursor-pointer rounded-full p-[0.8rem]',
        positionStyle[position],
        colorStyle[color].bgColor
      )}
      onClick={onClick}>
      {iconComponent[icon]}
    </button>
  );
};

export default FloatingButton;
