import React, { useState, useEffect, useCallback } from 'react';
import { IcSearch } from '@icons';

interface SearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onValueChange,
  placeholder = '지번, 도로명, 건물 이름으로 검색',
  className = '',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // debounce를 위한 useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onValueChange(inputValue);
      }
    }, 300); // 0.3초 debounce

    return () => clearTimeout(timer);
  }, [inputValue, value, onValueChange]);

  // 외부 value가 변경되면 내부 state도 업데이트
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <div className={`flex flex-col gap-[0.4rem] ${className}`}>
      <div
        className={`flex h-[4.4rem] items-center gap-[1rem] rounded border px-[1.2rem] py-[1rem] transition-all duration-200 ${
          disabled
            ? 'bg-background-disabled border-stroke-neutral-light cursor-not-allowed'
            : isFocused
              ? 'border-neutral-80'
              : 'border-stroke-neutral-dark'
        } `}>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`body1-16-medium placeholder:text-text-neutral-assistive flex-1 bg-transparent outline-none ${
            disabled
              ? 'text-text-neutral-assistive cursor-not-allowed'
              : 'text-text-neutral-primary'
          } `}
        />
        <IcSearch
          className={`pointer-events-none h-[2.4rem] w-[2.4rem] ${
            disabled ? 'text-icon-neutral-disabled' : 'text-icon-neutral-assistive'
          } `}
        />
      </div>
    </div>
  );
};

export default SearchInput;
