import { useFormContext } from 'react-hook-form';
import { type InputHTMLAttributes, useState, useCallback } from 'react';
import { IcChevronDown, IcChevronUp } from '@icons';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  name: string;
  size?: 'S' | 'M';
  type: 'date' | 'time' | 'cost' | 'number' | 'text' | 'contact';
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
  const formContext = useFormContext();

  if (!formContext) {
    console.warn('FormInput must be used within FormProvider');
    return null;
  }

  const {
    register,
    formState: { errors },
    watch,
  } = formContext;

  const error = errors[name]?.message as string | undefined;
  const registeredProps = register(name);
  const currentValue = watch(name); // 현재 값 감시

  // 날짜/시간 타입은 DropdownInput 사용
  if (type === 'date' || type === 'time') {
    return (
      <DropdownInput
        type={type}
        placeholder={placeholder}
        error={error}
        currentValue={currentValue}
        {...registeredProps}
        {...props}
      />
    );
  }

  // 나머지 타입은 Input 사용
  return (
    <Input
      name={name}
      size={size}
      type={type}
      description={description}
      placeholder={placeholder}
      error={error}
      register={register}
      {...props}
    />
  );
};

const DropdownInput = ({
  type,
  placeholder,
  error,
  currentValue,
  onBlur,
  ...props
}: {
  type: 'date' | 'time';
  placeholder?: string;
  error?: string;
  currentValue?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>) => {
  const [isFocused, setIsFocused] = useState(false);

  // 값이 있는지 확인 (빈 문자열이 아닌 실제 값)
  const hasValue = Boolean(currentValue && currentValue.trim() !== '');

  // 동적 클래스명 생성 - 값이 없을 때만 텍스트를 투명하게
  const inputClassName = `body1-16-medium flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 ${
    hasValue || isFocused
      ? 'text-text-neutral-primary [&::-webkit-datetime-edit]:text-text-neutral-primary [&::-webkit-datetime-edit-text]:text-text-neutral-primary [&::-webkit-datetime-edit-month-field]:text-text-neutral-primary [&::-webkit-datetime-edit-day-field]:text-text-neutral-primary [&::-webkit-datetime-edit-year-field]:text-text-neutral-primary [&::-webkit-datetime-edit-hour-field]:text-text-neutral-primary [&::-webkit-datetime-edit-minute-field]:text-text-neutral-primary [&::-webkit-datetime-edit-second-field]:text-text-neutral-primary [&::-webkit-datetime-edit-millisecond-field]:text-text-neutral-primary [&::-webkit-datetime-edit-meridiem-field]:text-text-neutral-primary'
      : 'text-transparent [&::-webkit-datetime-edit]:text-transparent [&::-webkit-datetime-edit-text]:text-transparent [&::-webkit-datetime-edit-month-field]:text-transparent [&::-webkit-datetime-edit-day-field]:text-transparent [&::-webkit-datetime-edit-year-field]:text-transparent [&::-webkit-datetime-edit-hour-field]:text-transparent [&::-webkit-datetime-edit-minute-field]:text-transparent [&::-webkit-datetime-edit-second-field]:text-transparent [&::-webkit-datetime-edit-millisecond-field]:text-transparent [&::-webkit-datetime-edit-meridiem-field]:text-transparent'
  }`;

  return (
    <div className='relative flex h-[5.1rem] w-full items-center border-b px-[1.6rem] transition-[color,box-shadow]'>
      <input
        type={type}
        className={inputClassName}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        aria-invalid={!!error}
        {...props}
      />

      {/* 커스텀 placeholder - 값이 없고 포커스되지 않았을 때만 표시 */}
      {!hasValue && !isFocused && placeholder && (
        <div className='body1-16-medium text-text-neutral-assistive pointer-events-none absolute left-[1.6rem] select-none'>
          {placeholder}
        </div>
      )}

      {/* 아이콘 - 순수 스타일링용 */}
      <div className='text-icon-neutral-primary flex-center pointer-events-none ml-[0.8rem] h-[2.4rem] w-[2.4rem] transition-transform duration-200'>
        {isFocused ? (
          <IcChevronUp className='h-[2.4rem] w-[2.4rem]' />
        ) : (
          <IcChevronDown className='h-[2.4rem] w-[2.4rem]' />
        )}
      </div>
    </div>
  );
};

const Input = ({
  name,
  size = 'M',
  type,
  description,
  placeholder,
  error,
  register,
  ...props
}: {
  name: string;
  size?: 'S' | 'M';
  type: 'cost' | 'number' | 'text' | 'contact';
  description?: string;
  placeholder?: string;
  error?: string;
  register: ReturnType<typeof useFormContext>['register'];
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>) => {
  const sizeStyles = {
    S: 'h-[4.4rem]',
    M: 'h-[5.1rem]',
  };

  // 포맷팅 함수들 (UI 표시용)
  const formatContact = useCallback((value: string): string => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }, []);

  const formatCost = useCallback((value: string): string => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers === '') return '';
    const numericValue = parseInt(numbers, 10);
    return isNaN(numericValue) ? '' : numericValue.toLocaleString();
  }, []);

  const formatNumber = useCallback((value: string): string => {
    return value.replace(/[^0-9]/g, '');
  }, []);

  // 표시용 값 state (포맷팅된 값)
  const [displayValue, setDisplayValue] = useState('');

  // React Hook Form의 register 분해
  const { onChange, onBlur, ref } = register(name);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;
      let formattedValue = inputValue;

      // 타입별 포맷팅 적용 (UI 표시용)
      switch (type) {
        case 'contact':
          formattedValue = formatContact(inputValue);
          break;
        case 'cost':
          formattedValue = formatCost(inputValue);
          break;
        case 'number':
          formattedValue = formatNumber(inputValue);
          break;
        default:
          formattedValue = inputValue;
      }

      // UI에 표시될 값 업데이트
      setDisplayValue(formattedValue);

      // React Hook Form에는 원본 숫자 값 저장 (포맷팅 제거)
      const rawValue =
        type === 'contact' || type === 'cost' || type === 'number'
          ? formattedValue.replace(/[^0-9]/g, '')
          : formattedValue;

      // React Hook Form의 onChange 호출
      onChange({
        target: {
          name,
          value: rawValue,
        },
      });
    },
    [type, formatContact, formatCost, formatNumber, onChange, name]
  );

  // cost 타입일 때 description 기본값 설정
  const finalDescription = type === 'cost' ? '원' : description;

  return (
    <div
      className={`relative flex w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] ${sizeStyles[size]} ${
        error
          ? 'focus-within:ring-red-10 border-red-50 focus-within:border-red-50'
          : 'border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20'
      }`}>
      <input
        type='text'
        className='body1-16-medium text-text-neutral-primary placeholder:text-text-neutral-assistive flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        ref={ref}
        aria-invalid={!!error}
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
