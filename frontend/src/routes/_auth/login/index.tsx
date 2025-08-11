import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { LoginForm } from '@auth/components';
import type { LoginFormValues } from '@auth/types';
import { PageLayout } from '@layouts';

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      // TODO: 실제 로그인 API 호출
      console.log('Login data:', data);

      // 로그인 성공 시 메인 페이지로 이동
      await navigate({ to: '/' });
    } catch (error) {
      console.error('Login failed:', error);
      // TODO: 에러 처리 (토스트 메시지 등)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className='bg-background-default-white flex min-h-screen items-center justify-center px-[2.0rem]'>
        <div className='flex w-full max-w-[40.0rem] flex-col items-center gap-[4.8rem]'>
          {/* Logo Section */}
          <div className='flex flex-col items-center gap-[1.6rem]'>
            <div className='bg-mint-50 flex h-[8.0rem] w-[8.0rem] items-center justify-center rounded-[1.6rem]'>
              <span className='display-32-bold text-neutral-0'>토닥</span>
            </div>
            <h1 className='headline-24-bold text-text-neutral-primary'>
              토닥과 함께 안전하게 동행하세요!
            </h1>
          </div>

          {/* Login Form Section */}
          <div className='flex w-full flex-col gap-[3.2rem]'>
            <div className='text-center'>
              <h2 className='subtitle-18-bold text-text-neutral-primary mb-[0.8rem]'>로그인</h2>
              <p className='body1-16-medium text-text-neutral-secondary'>
                계정 정보를 입력해 주세요
              </p>
            </div>

            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
