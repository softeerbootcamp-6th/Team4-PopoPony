import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@shared/lib';

interface FormTextareaProps extends Omit<React.ComponentProps<'textarea'>, 'name'> {
  name: string;
  className?: string;
  placeholder?: string;
  validation?: () => void;
}

function FormTextarea({
  name,
  className,
  placeholder = '요청사항을 입력해주세요',
  validation,
  ...props
}: FormTextareaProps) {
  const { register } = useFormContext();
  const { onChange, ...registerProps } = register(name);

  return (
    <textarea
      {...registerProps}
      onChange={(e) => {
        onChange(e);
        if (validation) {
          validation();
        }
      }}
      placeholder={placeholder}
      className={cn(
        'border-stroke-neutral-dark bg-background-default-white body1-16-medium placeholder:text-text-neutral-assistive focus:border-neutral-80 min-h-[14rem] w-full resize-none rounded-[0.6rem] border px-[1.2rem] py-[1rem] break-keep transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export default FormTextarea;
