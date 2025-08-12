import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { LoginForm } from '@auth/components';
import type { LoginFormValues } from '@auth/types';
import { PageLayout } from '@layouts';
import { postLogin } from '@auth/apis';
import { authStorage } from '@auth/utils';

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { mutate } = postLogin();

  const handleLogin = async (data: LoginFormValues) => {
    try {
      mutate(
        {
          body: {
            ...data,
          },
        },
        {
          onSuccess: () => {
            authStorage.setIsLoggedIn(true);
            navigate({
              to: '/',
            });
          },
        }
      );
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <PageLayout>
      <div className='bg-background-default-white flex min-h-screen items-center justify-center px-[2.0rem]'>
        <div className='flex w-full max-w-[40.0rem] flex-col items-center gap-[4.8rem]'>
          <div className='flex flex-col items-center gap-[1.6rem]'>
            <div className='bg-mint-50 flex h-[8.0rem] w-[8.0rem] items-center justify-center rounded-[1.6rem]'>
              <span className='display-32-bold text-neutral-0'>토닥</span>
            </div>
            <h1 className='headline-24-bold text-text-neutral-primary'>
              토닥과 함께 안전하게 동행하세요!
            </h1>
          </div>

          <div className='flex w-full flex-col gap-[3.2rem]'>
            <LoginForm onSubmit={handleLogin} isLoading={false} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
