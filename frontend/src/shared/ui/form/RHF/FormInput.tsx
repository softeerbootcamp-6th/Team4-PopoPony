import { IcChevronDown } from '@icons';

import { type InputHTMLAttributes, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { formatFormInputValue } from '@shared/lib';

type InputType = 'date' | 'time' | 'cost' | 'number' | 'text' | 'contact';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  name: string;
  size?: 'S' | 'M';
  type: InputType;
  description?: string | React.ReactNode;
  placeholder?: string;
  validation?: () => void;
}

const FormInput = ({
  name,
  size = 'M',
  type,
  description,
  placeholder,
  validation,
  ...props
}: FormInputProps) => {
  const { register } = useFormContext();

  const sizeStyles = {
    S: 'h-[4.4rem]',
    M: 'h-[5.1rem]',
  };

  const finalDescription = type === 'cost' ? '원' : description;

  if (type === 'date' || type === 'time') {
    const { getValues } = useFormContext();
    const { onChange, onBlur, ...registerProps } = register(name);
    const [hasValue, setHasValue] = useState(!!getValues(name));
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className='border-stroke-neutral-dark bg-background-default-white focus-within:border-neutral-80 relative flex h-[5.1rem] w-full items-center border-b transition-[color,box-shadow] focus-within:ring-0'>
        <div className='relative flex-1'>
          <input
            type={type}
            className='body1-16-medium text-text-neutral-primary w-full bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0'
            onFocus={() => {
              setIsFocused(true);
              setHasValue(true);
            }}
            onBlur={(e) => {
              onBlur(e);
              setIsFocused(false);
              setHasValue(!!e.target.value);
            }}
            onChange={(e) => {
              onChange(e);
              setHasValue(!!e.target.value);
              if (validation) {
                validation();
              }
            }}
            {...registerProps}
            {...props}
          />
          {!hasValue && placeholder && (
            <div className='title-20-medium bg-background-default-white text-text-neutral-assistive pointer-events-none absolute top-0 left-0 w-full'>
              {placeholder}
            </div>
          )}
        </div>
        <IcChevronDown
          className={`[&_path]:fill-icon-neutral-secondary pointer-events-none h-[2.4rem] w-[2.4rem] transition-transform duration-200 ${
            isFocused ? 'rotate-180' : ''
          }`}
        />
      </div>
    );
  }

  const { onChange, ...registerProps } = register(name);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatFormInputValue(e.target.value, type);
    e.target.value = formattedValue;
    onChange(e);
    if (validation) {
      validation();
    }
  };

  return (
    <div
      className={`border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20 relative flex w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] focus-within:ring-[0.3rem] ${sizeStyles[size]}`}>
      <input
        type='text'
        className='body1-16-medium text-text-neutral-primary placeholder:text-text-neutral-assistive w-full min-w-0 flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        placeholder={placeholder}
        onChange={(e) => {
          handleChange(e);
        }}
        {...registerProps}
        {...props}
      />
      {finalDescription && (
        <div className='body1-16-medium text-text-neutral-assistive ml-[0.8rem] select-none'>
          {finalDescription}
        </div>
      )}
    </div>
  );
};

export default FormInput;
