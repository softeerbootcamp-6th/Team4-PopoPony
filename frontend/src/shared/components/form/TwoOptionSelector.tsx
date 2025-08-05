import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  leftOption: { label: string; value: string | boolean };
  rightOption: { label: string; value: string | boolean };
}

const TwoOptionSelector = ({ name, leftOption, rightOption }: Props) => {
  const { register } = useFormContext();

  const options = [leftOption, rightOption];

  // 원본 값이 boolean인지 확인
  const hasBoolean = options.some((option) => typeof option.value === 'boolean');

  // 고유한 key를 생성하는 함수
  const getUniqueKey = (value: string | boolean, index: number): string => {
    return `${name}-${typeof value === 'boolean' ? value : value}-${index}`;
  };

  return (
    <div className='body1-16-medium text-neutral-90 flex-between gap-[2rem]'>
      {options.map((option, index) => {
        const uniqueKey = getUniqueKey(option.value, index);
        const stringValue =
          typeof option.value === 'boolean' ? option.value.toString() : option.value;

        return (
          <div key={uniqueKey} className='w-full'>
            <input
              type='radio'
              id={uniqueKey}
              value={stringValue}
              className='peer hidden'
              {...register(name, {
                // boolean 값이 있는 경우에만 변환 함수 적용
                ...(hasBoolean && {
                  setValueAs: (value: string) => {
                    // "true" -> true, "false" -> false로 변환
                    if (value === 'true') return true;
                    if (value === 'false') return false;
                    return value; // 문자열은 그대로 반환
                  },
                }),
              })}
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
