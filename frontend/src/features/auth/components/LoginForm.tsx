import { useForm, FormProvider } from 'react-hook-form';
import { Button, FormInput } from '@components';
import type { LoginFormValues } from '@auth/types';

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void;
  isLoading?: boolean;
}

const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const methods = useForm<LoginFormValues>({
    defaultValues: {
      loginId: '',
      password: '',
    },
  });

  const { handleSubmit, watch } = methods;
  const loginId = watch('loginId');
  const password = watch('password');

  const isFormValid = loginId.trim() !== '' && password.trim() !== '';

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-[2.4rem]'>
        <div className='flex flex-col gap-[1.6rem]'>
          <FormInput name='loginId' type='text' placeholder='아이디를 입력해주세요' size='M' />
          <div className='border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20 relative flex h-[5.1rem] w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] focus-within:ring-[0.3rem]'>
            <input
              {...methods.register('password')}
              type='password'
              placeholder='비밀번호를 입력해주세요'
              className='body1-16-medium text-text-neutral-primary placeholder:text-text-neutral-assistive w-full min-w-0 flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
        </div>

        <Button
          type='submit'
          variant='primary'
          size='lg'
          disabled={!isFormValid}
          isLoading={isLoading}
          className='w-full'>
          로그인
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
