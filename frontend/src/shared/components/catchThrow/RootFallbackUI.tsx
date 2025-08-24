import { useNavigate } from '@tanstack/react-router';
import { IcAlertCircle } from '@icons';
import { Button } from '@shared/components';

const RootFallbackUI = ({ error, onReset }: { error: Error; onReset?: () => void }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onReset) onReset();
    navigate({ to: '/' });
  };

  return (
    <>
      <div className='flex-center h-full w-full flex-col gap-[2rem] p-[5rem] text-center'>
        <IcAlertCircle className='text-text-red-primary' />
        <p className='body1-16-medium text-text-neutral-primary'>에러가 발생했습니다.</p>
        <p className='body1-16-medium text-text-neutral-primary'>{error.name}</p>
        <p className='body1-16-medium text-text-neutral-primary'>{error.message}</p>
        <Button size='md' onClick={handleClick}>
          홈으로 이동
        </Button>
      </div>
    </>
  );
};

export default RootFallbackUI;
