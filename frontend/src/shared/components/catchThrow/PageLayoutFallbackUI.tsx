import { PageLayout } from '@layouts';
import { Button } from '@components';
import { IcAlertCircle } from '@icons';

const PageLayoutFallbackUI = ({
  error,
  resetErrorBoundary = () => {},
}: {
  error: Error;
  resetErrorBoundary?: () => void;
}) => {
  return (
    <>
      <div className='flex-center h-full w-full flex-col gap-[2rem]'>
        <IcAlertCircle className='text-text-red-primary' />
        <p className='body1-16-medium text-text-neutral-primary'>에러가 발생했습니다.</p>
        <p className='body1-16-medium text-text-neutral-primary'>{error.message}</p>
        <div className='bg-bg-neutral-secondary w-full p-[2rem]'>
          <Button variant='secondary' size='md' onClick={resetErrorBoundary}>
            다시 시도
          </Button>
        </div>
      </div>
    </>
  );
};

export default PageLayoutFallbackUI;
