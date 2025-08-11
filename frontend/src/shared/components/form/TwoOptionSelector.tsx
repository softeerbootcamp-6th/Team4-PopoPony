import { useFormContext, useWatch } from 'react-hook-form';

interface Props {
  name: string;
  leftOption: { label: string; value: string };
  rightOption: { label: string; value: string };
}

const TwoOptionSelector = ({ name, leftOption, rightOption }: Props) => {
  const { register, setValue } = useFormContext();
  const currentValue = useWatch({ name });

  const parseValue = (value: string) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
    return value;
  };

  const options = [leftOption, rightOption];

  const getUniqueId = (value: string) => {
    return `${name}-${value}`;
  };

  return (
    <div className='body1-16-medium text-neutral-90 flex-between gap-[2rem]'>
      {options.map((option) => {
        const uniqueId = getUniqueId(option.value);
        return (
          <div key={uniqueId} className='w-full'>
            <input
              type='radio'
              id={uniqueId}
              value={option.value}
              className='peer hidden'
              checked={parseValue(option.value) === currentValue}
              {...register(name, {
                onChange: (e) => {
                  setValue(name, parseValue(e.target.value));
                },
              })}
            />
            <label
              htmlFor={uniqueId}
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
