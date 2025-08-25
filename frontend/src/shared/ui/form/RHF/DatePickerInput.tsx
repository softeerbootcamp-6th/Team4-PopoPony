import { IcChevronDown } from '@icons';

import { useRef, useState } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import { useClickOutside } from '@shared/hooks';
import { cn, dateFormat } from '@shared/lib';
import { DatePicker } from '@shared/ui/DatePicker';

interface DatePickerInputProps {
  name: string;
  placeholder?: string;
  disabledDate?: (date: Date) => boolean;
  disabled?: boolean;
}

const DatePickerInput = ({
  name,
  placeholder = '날짜 선택',
  disabled,
  disabledDate,
}: DatePickerInputProps) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const { setValue, control } = useFormContext();
  const selected = useWatch({ control, name });

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDate = (date: Date) => {
    setValue(name, dateFormat(date.toISOString(), 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const handleToggleCalendar = () => {
    setIsOpen((prev) => !prev);
  };

  // 캘린더 밖 영역 클릭 시 닫기
  useClickOutside({
    ref: calendarRef,
    handler: () => setIsOpen(false),
    enabled: isOpen,
  });

  const selectedValue = () => {
    if (disabled) return '-';
    else if (!selected) return placeholder;
    else return dateFormat(selected, 'yyyy. MM. dd');
  };

  return (
    <div
      ref={calendarRef}
      className={cn(
        'border-stroke-neutral-dark bg-background-default-white relative flex h-[5.1rem] w-full items-center border-b transition-[color,box-shadow]',
        disabled && 'pointer-events-none'
      )}>
      {isOpen && (
        <div className='absolute top-[6rem] left-0 z-10'>
          <DatePicker
            mode='single'
            selected={selected}
            captionLayout='dropdown'
            disabled={disabledDate}
            onSelect={handleSelectDate}
            required
          />
        </div>
      )}
      <div className='flex-between w-full cursor-pointer' onClick={handleToggleCalendar}>
        <div
          className={cn(
            'body1-16-medium bg-background-default-white pointer-events-none w-full',
            selected ? 'text-text-neutral-primary' : 'text-text-neutral-assistive'
          )}>
          {selectedValue()}
        </div>
        <IcChevronDown
          className={`[&_path]:fill-icon-neutral-secondary pointer-events-none h-[2.4rem] w-[2.4rem] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
    </div>
  );
};

export default DatePickerInput;
