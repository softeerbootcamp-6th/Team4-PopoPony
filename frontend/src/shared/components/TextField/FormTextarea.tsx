import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/shared/libs/utils';

interface FormTextareaProps extends Omit<React.ComponentProps<'textarea'>, 'name'> {
  name: string;
  className?: string;
  validation?: () => void;
}

function FormTextarea({ name, className, validation, ...props }: FormTextareaProps) {
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
      className={cn(
        'rounded-[0.6rem]border border-stroke-neutral-dark bg-background-default-white body1-16-medium placeholder:text-text-neutral-assistive focus:border-neutral-80 resize-none px-[1.2rem] py-[1rem] transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export default FormTextarea;
