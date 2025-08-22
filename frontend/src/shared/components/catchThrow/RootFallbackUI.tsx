import { useNavigate } from '@tanstack/react-router';
import { IcAlertCircle } from '@icons';
import { PageLayout } from '@layouts';
import { Button } from '@components';

const RootFallbackUI = ({ error }: { error: Error }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/' });
  };

  return (
    <PageLayout>
      <div className='flex-center h-full w-full flex-col gap-[2rem] p-[5rem]'>
        <IcAlertCircle className='text-text-red-primary' />
        <p className='body1-16-medium text-text-neutral-primary'>에러가 발생했습니다.</p>
        <p className='body1-16-medium text-text-neutral-primary'>{error.message}</p>
        <Button variant='secondary' size='md' onClick={handleClick}>
          홈으로 이동
        </Button>
      </div>
    </PageLayout>
  );
};

export default RootFallbackUI;
