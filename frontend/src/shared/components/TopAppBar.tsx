import { useRouter } from '@tanstack/react-router';
import { IcArrowLeft, IcCloseM } from '@icons';

export interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  showClose?: boolean;
  background?: boolean;
  onClose?: () => void;
  className?: string;
}

const TopAppBar = ({
  title,
  showBack = false,
  showClose = false,
  background = true,
  onClose,
  className = '',
}: TopAppBarProps) => {
  const router = useRouter();
  const handleBack = () => {
    router.history.back();
  };

  const backgroundClass = background ? 'bg-background-default-white' : 'bg-transparent';

  return (
    <header
      className={`flex-between z-20 h-[5.6rem] w-full px-[2rem] ${backgroundClass} ${className}`}>
      <div className='flex-start h-[4rem] w-[4rem]'>
        {showBack && (
          <button
            type='button'
            onClick={handleBack}
            className='flex-center text-text-neutral-primary'
            aria-label='뒤로 가기'>
            <IcArrowLeft className='h-[2.4rem] w-[2.4rem]' />
          </button>
        )}
      </div>

      <div className='flex-center flex-1'>
        {title && (
          <h1 className='subtitle-18-bold text-text-neutral-primary cursor-default text-center'>
            {title}
          </h1>
        )}
      </div>

      <div className='flex-end h-[4rem] w-[4rem]'>
        {showClose && (
          <button
            type='button'
            onClick={onClose}
            className='flex-center text-text-neutral-primary'
            aria-label='닫기'>
            <IcCloseM />
          </button>
        )}
      </div>
    </header>
  );
};

export default TopAppBar;
