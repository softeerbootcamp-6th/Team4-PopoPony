import { type InputHTMLAttributes, forwardRef } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ placeholder, className = '', ...props }, ref) => {
    return (
      <div className='border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20 relative flex h-[5.1rem] w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] focus-within:ring-[0.3rem]'>
        <input
          ref={ref}
          placeholder={placeholder}
          className={`body1-16-medium text-text-neutral-primary placeholder:text-text-neutral-assistive w-full min-w-0 flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

export default AuthInput;
