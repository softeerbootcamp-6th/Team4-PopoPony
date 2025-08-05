import { useFormContext } from 'react-hook-form';
import { type InputHTMLAttributes, useCallback } from 'react';
import { IcChevronDown } from '@icons';

type InputType = 'date' | 'time' | 'cost' | 'number' | 'text' | 'contact';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  name: string;
  size?: 'S' | 'M';
  type: InputType;
  description?: string;
  placeholder?: string;
}

const FormInput = ({
  name,
  size = 'M',
  type,
  description,
  placeholder,
  ...props
}: FormInputProps) => {
  const { register } = useFormContext();

  const sizeStyles = {
    S: 'h-[4.4rem]',
    M: 'h-[5.1rem]',
  };

  // cost 타입일 때 description 기본값 설정
  const finalDescription = type === 'cost' ? '원' : description;

  // 포맷팅 함수를 useCallback으로 메모이제이션
  const formatValue = useCallback((value: string, inputType: string) => {
    switch (inputType) {
      case 'contact':
        const numbers = value.replace(/[^0-9]/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
      case 'cost':
        const costNum = value.replace(/[^0-9]/g, '');
        return costNum ? parseInt(costNum, 10).toLocaleString() : '';
      case 'number':
        return value.replace(/[^0-9]/g, '');
      default:
        return value;
    }
  }, []);

  // onChange 핸들러를 useCallback으로 메모이제이션
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatValue(e.target.value, type);
      e.target.value = formattedValue;
    },
    [formatValue, type]
  );

  // 날짜/시간 타입
  if (type === 'date' || type === 'time') {
    return (
      <div className='border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20 relative flex h-[5.1rem] w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] focus-within:ring-[0.3rem]'>
        <input
          type={type}
          className='body1-16-medium text-text-neutral-primary flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0'
          placeholder={placeholder}
          {...register(name)} // onChange 옵션 제거
          {...props}
        />
        <IcChevronDown className='text-icon-neutral-primary pointer-events-none h-[2.4rem] w-[2.4rem]' />
      </div>
    );
  }

  // register props 가져오기
  const { onChange, ...registerProps } = register(name);

  // 일반 input 타입
  return (
    <div
      className={`border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20 relative flex w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] focus-within:ring-[0.3rem] ${sizeStyles[size]}`}>
      <input
        type='text'
        className='body1-16-medium text-text-neutral-primary placeholder:text-text-neutral-assistive min-w-0 flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        placeholder={placeholder}
        onChange={(e) => {
          handleChange(e); // 포맷팅 적용
          onChange(e); // React Hook Form의 onChange 호출
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
