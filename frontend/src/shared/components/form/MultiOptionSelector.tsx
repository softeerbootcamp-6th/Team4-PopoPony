import { useFormContext } from 'react-hook-form';

/**
 * @param options 문자열 리스트
 * @param showHelperText 도움말 텍스트 표시 여부
 * @param dataFormat 데이터 저장 형식 ('string' | 'object')
 */
interface Props {
  name: string;
  options: readonly string[];
  showHelperText?: boolean;
  dataFormat?: 'string' | 'object';
}

const MultiOptionSelector = ({
  name,
  options,
  showHelperText = true,
  dataFormat = 'string',
}: Props) => {
  const { watch } = useFormContext();
  const selectedValues = watch(name) || [];

  return (
    <div className='flex flex-wrap gap-[1rem]'>
      {options.map((option) => {
        // selectedValues가 객체 배열인 경우 (CertificateItemSchema)
        const isSelected =
          dataFormat === 'object' && Array.isArray(selectedValues) && selectedValues.length > 0
            ? selectedValues.some((item) =>
                typeof item === 'object' && item !== null && 'type' in item
                  ? item.type === option
                  : item === option
              )
            : selectedValues.includes(option);

        return (
          <Option
            key={option}
            name={name}
            value={option}
            isSelected={isSelected}
            dataFormat={dataFormat}
          />
        );
      })}
      {showHelperText && (
        <p className='caption12-12-medium text-text-neutral-assistive w-full'>*복수선택 가능</p>
      )}
    </div>
  );
};

const Option = ({
  name,
  value,
  isSelected,
  dataFormat,
}: {
  name: string;
  value: string;
  isSelected: boolean;
  dataFormat: 'string' | 'object';
}) => {
  const { setValue, watch } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValues = watch(name) || [];

    if (e.target.checked) {
      // 선택된 경우
      if (dataFormat === 'object') {
        // CertificateItemSchema 형태로 추가
        const newItem = { type: value, certificateImageUrl: '' };
        setValue(name, [...currentValues, newItem]);
      } else {
        // 문자열로 추가
        setValue(name, [...currentValues, value]);
      }
    } else {
      // 해제된 경우: 해당 타입의 항목 제거
      const filteredValues = currentValues.filter((item: unknown) => {
        if (dataFormat === 'object') {
          return typeof item === 'object' && item !== null && 'type' in item
            ? (item as { type: string }).type !== value
            : item !== value;
        } else {
          return item !== value;
        }
      });
      setValue(name, filteredValues);
    }
  };

  return (
    <label
      htmlFor={`${name}-${value}`}
      className={`flex cursor-pointer rounded-[0.4rem] px-[1.6rem] py-[1rem] transition-all duration-200 ${
        isSelected
          ? 'bg-mint-5 border-mint-50 border'
          : 'border-stroke-neutral-dark hover:border-mint-50 border'
      } `}>
      <div className='flex items-center gap-[0.8rem]'>
        <input
          type='checkbox'
          id={`${name}-${value}`}
          checked={isSelected}
          onChange={handleChange}
          className='sr-only' // 숨겨진 체크박스
        />
        <span
          className={`body1-16-medium ${isSelected ? 'text-text-mint-on-primary' : 'text-text-neutral-primary'} `}>
          {value}
        </span>
      </div>
    </label>
  );
};

export default MultiOptionSelector;
