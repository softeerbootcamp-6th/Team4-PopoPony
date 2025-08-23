import { formatFormInputValue } from '@utils';
import { useFormContext } from 'react-hook-form';
import ReceiptImageUpload from './ReceiptImageUpload';

interface TaxiFeeSectionProps {
  title: string;
  feeFieldName: string;
  receiptFieldName: string;
  placeholder: string;
}
const TaxiFeeSection = ({
  title,
  feeFieldName,
  receiptFieldName,
  placeholder,
}: TaxiFeeSectionProps) => {
  const { register } = useFormContext();

  return (
    <div className='flex flex-col gap-[0.8rem]'>
      <span className='body2-14-medium text-text-neutral-secondary'>{title}</span>
      <div
        className={`border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20 relative flex h-[5.1rem] w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] focus-within:ring-[0.3rem]`}>
        <input
          type='text'
          inputMode='numeric'
          className='body1-16-medium text-text-neutral-primary placeholder:text-text-neutral-assistive w-full min-w-0 flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
          placeholder='택시 요금'
          {...register(feeFieldName, {
            onChange: (e) => {
              const formattedValue = formatFormInputValue(e.target.value, 'cost');
              e.target.value = formattedValue;
            },
          })}
        />
        <div className='body1-16-medium text-text-neutral-assistive ml-[0.8rem] select-none'>
          원
        </div>
      </div>
      <ReceiptImageUpload name={receiptFieldName} prefix='uploads/taxi' placeholder={placeholder} />
    </div>
  );
};

export default TaxiFeeSection;
