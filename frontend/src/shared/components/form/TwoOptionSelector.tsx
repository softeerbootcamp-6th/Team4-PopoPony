import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  leftOption: { label: string; value: string | boolean };
  rightOption: { label: string; value: string | boolean };
}

const TwoOptionSelector = ({ name, leftOption, rightOption }: Props) => {
  const { register } = useFormContext();

  const options = [leftOption, rightOption];

  // value를 string으로 변환하는 함수
  const getStringValue = (value: string | boolean): string => {
    return typeof value === 'boolean' ? value.toString() : value;
  };

  // 고유한 key를 생성하는 함수
  const getUniqueKey = (value: string | boolean, index: number): string => {
    return typeof value === 'boolean' ? `${value}-${index}` : value;
  };

  return (
    <div className='body1-16-medium text-neutral-90 flex-between gap-[2rem]'>
      {options.map((option, index) => {
        const stringValue = getStringValue(option.value);
        const uniqueKey = getUniqueKey(option.value, index);

        return (
          <div key={uniqueKey} className='w-full'>
            <input
              type='radio'
              id={uniqueKey}
              value={stringValue}
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
