import { useForm } from 'react-hook-form';
import { Button } from '@components';
import type { LoginFormValues } from '@auth/types';
import { authStorage } from '@auth/utils';
import { useNavigate } from '@tanstack/react-router';
import { postLogin } from '@auth/apis';
import { AuthInput } from '@auth/components';
import { toast } from 'sonner';

const LoginForm = () => {
  const navigate = useNavigate();
  const { mutate } = postLogin();

  const { register, handleSubmit, watch } = useForm<LoginFormValues>({
    defaultValues: {
      loginId: '',
      password: '',
    },
  });

  const loginId = watch('loginId');
  const password = watch('password');

  const isFormValid = loginId.trim() !== '' && password.trim() !== '';

  const handleLogin = async (data: LoginFormValues) => {
    mutate(
      {
        body: {
          ...data,
        },
      },
      {
        onSuccess: (data) => {
          if (data.status === 200) {
            authStorage.setIsLoggedIn(true);
            navigate({
              to: '/',
            });
          } else {
            toast.error(data.message);
          }
        },
        onError: (error: { message: string }) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className='flex w-full flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        <AuthInput {...register('loginId')} type='text' placeholder='아이디를 입력해주세요' />
        <AuthInput
          {...register('password')}
          type='password'
          placeholder='비밀번호를 입력해주세요'
        />
      </div>

      <Button type='submit' variant='primary' size='lg' disabled={!isFormValid} className='w-full'>
        로그인
      </Button>
    </form>
  );
};

export default LoginForm;
