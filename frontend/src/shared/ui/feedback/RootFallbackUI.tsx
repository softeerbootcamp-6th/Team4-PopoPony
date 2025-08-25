import { useNavigate } from '@tanstack/react-router';

import { ApiError, AuthError, NotFoundError } from '@shared/api';
import { Button } from '@shared/ui';

const RootFallbackUI = ({ error, onReset }: { error: Error; onReset?: () => void }) => {
  const navigate = useNavigate();

  const handleClickHome = async () => {
    await navigate({ to: '/' });
    if (onReset) onReset();
  };
  const handleClickLogin = async () => {
    await navigate({ to: '/login' });
    if (onReset) onReset();
  };
  const handleClickRefresh = async () => {
    window.location.reload();
  };

  const ButtonToSolution = () => {
    if (error instanceof AuthError)
      return (
        <Button variant='assistive' size='md' onClick={handleClickLogin}>
          로그인 화면으로 가기
        </Button>
      );
    if (error instanceof ApiError || error instanceof NotFoundError)
      return (
        <Button variant='assistive' size='md' onClick={handleClickHome}>
          홈으로 이동
        </Button>
      );
    return (
      <Button variant='assistive' size='md' onClick={handleClickRefresh}>
        새로고침
      </Button>
    );
  };

  return (
    <>
      <div className='flex-center h-full w-full flex-col gap-[2rem] p-[5rem] text-center'>
        <img className='w-[50%]' src='/images/report.svg' alt='오류 이미지' />
        <p className='headline-24-bold text-text-neutral-primary'>일시적인 오류가 발생했습니다..</p>
        {/* <p className='body1-16-medium text-text-neutral-secondary'>에러 종류: {error.name}</p> */}
        <p className='body1-16-medium text-text-neutral-primary'>{error.message}</p>
        <ButtonToSolution />
      </div>
    </>
  );
};

export default RootFallbackUI;
