import { useRouter } from '@tanstack/react-router';
import { IcArrowLeft, IcCloseL } from '@icons';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  showClose?: boolean;
  background?: boolean;
  onClose?: () => void;
}

const TopAppBar = ({
  title,
  showBack = false,
  showClose = false,
  background = true,
  onClose,
}: TopAppBarProps) => {
  const router = useRouter();
  const handleBack = () => {
    router.history.back();
  };

  const backgroundClass = background
    ? 'bg-[var(--color-background-default-white)]'
    : 'bg-transparent';

  return (
    <header
      className={`fixed top-0 left-1/2 z-50 flex h-[6rem] w-full max-w-[600px] min-w-[375px] -translate-x-1/2 items-center justify-between px-[2rem] ${backgroundClass}`}>
      {/* Left - Back Button */}
      <div className='flex h-[4rem] w-[4rem] items-center justify-start'>
        {showBack && (
          <button
            type='button'
            onClick={handleBack}
            className='flex-center h-[4rem] w-[4rem] text-[var(--color-icon-neutral-primary)]'
            aria-label='뒤로 가기'>
            <IcArrowLeft className='h-[2.4rem] w-[2.4rem]' />
          </button>
        )}
      </div>

      {/* Center - Title */}
      <div className='flex-center flex-1'>
        {title && (
          <h1 className='subtitle-18-bold cursor-default text-center text-[var(--color-text-neutral-primary)]'>
            {title}
          </h1>
        )}
      </div>

      {/* Right - Close Button */}
      <div className='flex h-[4rem] w-[4rem] items-center justify-end'>
        {showClose && (
          <button
            type='button'
            onClick={onClose}
            className='flex-center h-[4rem] w-[4rem] text-[var(--color-icon-neutral-primary)]'
            aria-label='닫기'>
            <IcCloseL className='h-[2.4rem] w-[2.4rem]' />
          </button>
        )}
      </div>
    </header>
  );
};

export default TopAppBar;
