import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  leftOption: { label: string; value: string };
  rightOption: { label: string; value: string };
}

const TwoOptionSelector = ({ name, leftOption, rightOption }: Props) => {
  const { register } = useFormContext();

  const options = [leftOption, rightOption];

  return (
    <div className='body1-16-medium text-neutral-90 flex gap-[2rem]'>
      {options.map((option) => (
        <div key={option.value} className='flex w-full'>
          <input
            type='radio'
            id={option.value}
            value={option.value}
            className='peer hidden'
            {...register(name)}
          />
          <label
            htmlFor={option.value}
            className='border-neutral-20 peer-checked:border-mint-60 peer-checked:bg-mint-5 peer-checked:text-mint-70 flex h-[4.8rem] w-full cursor-pointer items-center justify-center rounded-[0.4rem] border'>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default TwoOptionSelector;
