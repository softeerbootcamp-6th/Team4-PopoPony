import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  leftOption: { label: string; value: string };
  rightOption: { label: string; value: string };
}

const TwoOptionSelector = ({ name, leftOption, rightOption }: Props) => {
  const { register } = useFormContext();

  const options = [leftOption, rightOption];

  // 고유한 key를 생성하는 함수
  const getUniqueKey = (value: string | boolean, index: number): string => {
    return `${name}-${value}-${index}`;
  };

  return (
    <div className='body1-16-medium text-neutral-90 flex-between gap-[2rem]'>
      {options.map((option, index) => {
        const uniqueKey = getUniqueKey(option.value, index);

        return (
          <div key={uniqueKey} className='w-full'>
            <input
              type='radio'
              id={uniqueKey}
              value={option.value}
              className='peer hidden'
              {...register(name)}
            />
            <label
              htmlFor={uniqueKey}
              className='border-neutral-20 peer-checked:border-mint-60 peer-checked:bg-mint-5 peer-checked:text-mint-70 flex-center h-[4.8rem] w-full cursor-pointer rounded-[0.4rem] border'>
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default TwoOptionSelector;
