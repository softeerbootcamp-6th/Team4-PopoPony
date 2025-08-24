import { Button } from '@components';
import { ApiError, AuthError, NotFoundError } from '@apis';
import { useNavigate } from '@tanstack/react-router';

const FallbackUI = ({ error, onReset }: { error: Error; onReset?: () => void }) => {
  const navigate = useNavigate();

  const handleClickHome = () => {
    if (onReset) onReset();
    navigate({ to: '/' });
  };
  const handleClickLogin = () => {
    if (onReset) onReset();
    navigate({ to: '/login' });
  };
  const handleClickRefresh = () => {
    if (onReset) onReset();
    window.location.reload();
  };

  const ButtonToSolution = () => {
    if (error instanceof AuthError)
      return (
        <Button size='md' onClick={handleClickLogin}>
          로그인 화면으로 가기
        </Button>
      );
    if (error instanceof ApiError || error instanceof NotFoundError)
      return (
        <Button size='md' onClick={handleClickHome}>
          홈으로 이동
        </Button>
      );
    return (
      <Button size='md' onClick={handleClickRefresh}>
        새로고침
      </Button>
    );
  };

  return (
    <div className='flex h-full w-full flex-col items-center gap-[2rem] p-[5rem] text-center'>
      <img className='w-[50%]' src='/images/report.svg' alt='오류 이미지' />
      <p className='title-20-bold text-text-neutral-primary'>일시적인 오류가 발생했습니다..</p>
      <p className='body1-16-medium text-text-neutral-primary'>{error.message}</p>
      <ButtonToSolution />
    </div>
  );
};

export default FallbackUI;
