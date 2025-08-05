import { useFormContext } from 'react-hook-form';
import { IcCheck } from '@icons';

interface Props {
  name: string;
  options: { label: string; value: string }[];
  showHelperText?: boolean;
}

const MultiOptionSelector = ({ name, options, showHelperText = true }: Props) => {
  const { watch } = useFormContext();
  const selectedValues = watch(name) || [];

  return (
    <div className='flex flex-col gap-[0.8rem]'>
      {options.map((option) => (
        <Option
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          isSelected={selectedValues.includes(option.value)}
        />
      ))}
      {showHelperText && (
        <p className='text-text-neutral-assistive text-[1.2rem] leading-[150%] font-medium tracking-[-0.048rem]'>
          *복수선택 가능
        </p>
      )}
    </div>
  );
};

const Option = ({
  name,
  value,
  label,
  isSelected,
}: {
  name: string;
  value: string;
  label: string;
  isSelected: boolean;
}) => {
  const { register } = useFormContext();

  return (
    <label
      htmlFor={`${name}-${value}`}
      className={`flex cursor-pointer items-center justify-between rounded px-[1.6rem] py-[1rem] transition-all duration-200 ${
        isSelected
          ? 'bg-mint-5 border-mint-50 border'
          : 'border-stroke-neutral-dark hover:border-mint-50 border'
      } `}>
      <div className='flex items-center gap-[0.8rem]'>
        <input
          type='checkbox'
          id={`${name}-${value}`}
          value={value}
          {...register(name)}
          className='sr-only' // 숨겨진 체크박스
        />
        <span
          className={`body1-16-medium ${isSelected ? 'text-text-mint-on-primary' : 'text-text-neutral-primary'} `}>
          {label}
        </span>
      </div>
      <div className='flex h-[2.8rem] w-[2.8rem] items-center justify-center'>
        {isSelected ? (
          <IcCheck className='text-text-mint-on-primary h-[2.4rem] w-[2.4rem]' />
        ) : (
          <div className='border-icon-neutral-disabled h-[2.4rem] w-[2.4rem] rounded border' />
        )}
      </div>
    </label>
  );
};

export default MultiOptionSelector;
