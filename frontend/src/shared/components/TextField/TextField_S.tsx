import { type InputHTMLAttributes, forwardRef, useState } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  // 크기
  size: 'S' | 'M';

  // 타입
  type: 'text' | 'file' | 'unit';

  // 단위 (type이 'unit'일 때만)
  unit?: '세' | '원';

  // 라벨
  label?: string;

  // 파일 타입용 (파일 선택 버튼 클릭 시)
  onFileSelect?: () => void;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      size = 'M',
      type = 'text',
      unit,
      label,
      value,
      placeholder = 'Placeholder',
      readOnly = false,
      onFileSelect,
      onFocus,
      onBlur,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = Boolean(value && String(value).length > 0);

    // 크기별 스타일
    const sizeStyles = {
      S: 'h-[4.4rem]',
      M: 'h-[5.1rem]',
    };

    // 상태별 테두리 스타일
    const getBorderStyle = () => {
      if (isFocused) return 'border-[#494f5a]'; // Selected/Focus
      if (hasValue) return 'border-[#e0e2e6]'; // Typed
      return 'border-[#e0e2e6]'; // Default
    };

    // 텍스트 색상 스타일
    const getTextColor = () => {
      if (hasValue) return 'text-[#32363e]'; // Typed
      return 'text-[#a0a5b1]'; // Default/Placeholder
    };

    // 값 포맷팅 (원 단위일 때 toLocaleString 적용)
    const getFormattedValue = () => {
      if (type === 'unit' && unit === '원' && value) {
        const numValue =
          typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : Number(value);
        return isNaN(numValue) ? value : numValue.toLocaleString();
      }
      return value;
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleFileClick = () => {
      if (type === 'file' && onFileSelect) {
        onFileSelect();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'unit' && unit === '원') {
        // 숫자만 추출해서 onChange에 전달
        const numericValue = e.target.value.replace(/[^\d]/g, '');
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: numericValue },
        };
        onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      } else {
        onChange?.(e);
      }
    };

    return (
      <div className='flex w-full flex-col gap-1'>
        {/* Label */}
        {label && (
          <label className="font-['Pretendard'] text-[1.4rem] leading-[1.5] font-medium tracking-[-0.028rem] text-[#636a79]">
            {label}
          </label>
        )}

        {/* Input Container */}
        <div
          className={`relative flex w-full items-center justify-start rounded border border-solid px-[1.2rem] py-[1rem] ${sizeStyles[size]} ${getBorderStyle()} ${type === 'file' ? 'cursor-pointer' : ''} `}
          onClick={type === 'file' ? handleFileClick : undefined}>
          {/* Input Field */}
          <input
            ref={ref}
            type={type === 'file' ? 'text' : 'text'}
            {...(value !== undefined ? { value: getFormattedValue() } : {})}
            placeholder={placeholder}
            readOnly={readOnly || type === 'file'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={`flex-1 border-none bg-transparent font-['Pretendard'] text-[1.6rem] leading-[1.5] font-medium tracking-[-0.032rem] outline-none ${getTextColor()} ${type === 'file' ? 'cursor-pointer' : ''} `}
            {...props}
          />

          {/* Unit Display */}
          {type === 'unit' && unit && (
            <div className="ml-[1rem] font-['Pretendard'] text-[1.6rem] leading-[1.5] font-medium tracking-[-0.032rem] text-[#636a79]">
              {unit}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
