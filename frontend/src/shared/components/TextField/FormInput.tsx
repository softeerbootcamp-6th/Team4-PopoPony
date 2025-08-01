import { useFormContext } from 'react-hook-form';
import { type InputHTMLAttributes, useState, createContext, useContext } from 'react';
import { IcChevronDown, IcChevronUp, IcCheck } from '@icons';

// FormInput 컨텍스트 (Label에서 설정한 name을 Input에서 사용하기 위해)
const FormInputContext = createContext<{ name?: string }>({});

const FormInput = ({ children }: { children: React.ReactNode }) => {
  return <section className='flex flex-col gap-2'>{children}</section>;
};

interface FormInputLabelProps {
  text: string;
  name?: string; // doCheck가 true일 때 필요
  doCheck?: boolean;
  required?: boolean;
}

const FormInputLabel = ({ text, name, doCheck = false, required = false }: FormInputLabelProps) => {
  const formContext = useFormContext();

  // 체크 상태 계산 (더 정확한 로직)
  const getIsChecked = (): boolean => {
    if (!doCheck || !name || !formContext) return false;

    const { watch } = formContext;
    const fieldValue = watch(name);

    if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
      return false;
    }

    // 배열인 경우 길이 체크
    if (Array.isArray(fieldValue)) {
      return fieldValue.length > 0;
    }

    // 문자열인 경우 trim 후 길이 체크
    if (typeof fieldValue === 'string') {
      return fieldValue.trim().length > 0;
    }

    // 그 외의 경우 truthy 체크
    return Boolean(fieldValue);
  };

  const isChecked = getIsChecked();

  return (
    <FormInputContext.Provider value={{ name }}>
      <div className='flex items-center gap-2'>
        <h6 className='body1-16-bold text-neutral-90'>
          {text}
          {required && <span className='ml-1 text-red-50'>*</span>}
        </h6>
        {doCheck && (
          <IcCheck
            className={`${isChecked ? '[&_path]:stroke-mint-50' : '[&_path]:stroke-neutral-90'}`}
          />
        )}
      </div>
    </FormInputContext.Provider>
  );
};

interface FormInputInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string;
  size?: 'S' | 'M';
  type: 'date' | 'time' | 'cost' | 'number' | 'text' | 'contact';
  description?: string;
  placeholder?: string;
  label?: string; // input 내부 라벨 (선택적)
}

const FormInputInput = ({
  name,
  size = 'M',
  type,
  description,
  placeholder,
  label,
  ...props
}: FormInputInputProps) => {
  const formContext = useFormContext();

  if (!formContext) {
    console.warn('FormInputInput must be used within FormProvider');
  }

  const {
    register,
    formState: { errors },
  } = formContext || {};

  const error = errors?.[name]?.message as string | undefined;
  const registeredProps = register?.(name) || {};

  return (
    <div className='flex flex-col gap-[0.4rem]'>
      {/* Optional Internal Label */}
      {label && <div className='body2-14-medium text-text-neutral-secondary'>{label}</div>}

      {/* Input Component */}
      {type === 'date' || type === 'time' ? (
        <DropdownInput
          type={type}
          placeholder={placeholder}
          error={error}
          {...registeredProps}
          {...props}
        />
      ) : (
        <Input
          size={size}
          type={type}
          description={description}
          placeholder={placeholder}
          error={error}
          {...registeredProps}
          {...props}
        />
      )}

      {/* Error Message */}
      {error && <div className='body2-14-medium text-red-50'>{error}</div>}
    </div>
  );
};

// FormInput 내부에서 사용되는 다른 컴포넌트들을 위한 래퍼
const FormInputContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const DropdownInput = ({
  type,
  placeholder,
  error,
  onBlur,
  ...props
}: {
  type: 'date' | 'time';
  placeholder?: string;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative flex h-[5.1rem] w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] ${
        error
          ? 'focus-within:ring-red-10 border-red-50 focus-within:border-red-50'
          : 'border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20'
      }`}>
      <input
        type={type}
        className='text-text-neutral-primary placeholder:text-text-neutral-assistive flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        aria-invalid={!!error}
        {...props}
      />
      <div className='text-icon-neutral-primary flex-center ml-[0.8rem] h-[2.4rem] w-[2.4rem] transition-transform duration-200'>
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
  size = 'M',
  type,
  description,
  placeholder,
  error,
  onChange,
  value,
  ...props
}: {
  size?: 'S' | 'M';
  type: 'cost' | 'number' | 'text' | 'contact';
  description?: string;
  placeholder?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'onChange'>) => {
  const sizeStyles = {
    S: 'h-[4.4rem]',
    M: 'h-[5.1rem]',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // 숫자만 입력 가능하도록 제한 (cost, number, contact)
    if (type === 'cost' || type === 'number' || type === 'contact') {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }

    // contact 타입: 000-0000-0000 형태로 포맷팅
    if (type === 'contact' && inputValue.length > 0) {
      if (inputValue.length <= 3) {
        inputValue = inputValue;
      } else if (inputValue.length <= 7) {
        inputValue = `${inputValue.slice(0, 3)}-${inputValue.slice(3)}`;
      } else {
        inputValue = `${inputValue.slice(0, 3)}-${inputValue.slice(3, 7)}-${inputValue.slice(7, 11)}`;
      }
    }

    // cost 타입: toLocaleString 적용 (빈 값 처리 개선)
    if (type === 'cost' && inputValue.length > 0) {
      const numericValue = parseInt(inputValue, 10);
      if (!isNaN(numericValue)) {
        inputValue = numericValue.toLocaleString();
      }
    }

    // number 타입: 숫자만 허용
    if (type === 'number' && inputValue.length > 0) {
      const numericValue = parseInt(inputValue, 10);
      if (!isNaN(numericValue)) {
        inputValue = numericValue.toString();
      }
    }

    // 원본 onChange 이벤트 호출
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: inputValue,
        },
      };
      onChange(syntheticEvent);
    }
  };

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
        className='text-text-neutral-primary placeholder:text-text-neutral-assistive flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        aria-invalid={!!error}
        {...props}
      />
      {finalDescription && (
        <div className='text-text-neutral-assistive ml-[0.8rem] select-none'>
          {finalDescription}
        </div>
      )}
    </div>
  );
};

// Compound Component Export
FormInput.Label = FormInputLabel;
FormInput.Input = FormInputInput;
FormInput.Content = FormInputContent;

export default FormInput;
