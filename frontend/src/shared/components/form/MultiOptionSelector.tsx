import { useFormContext } from 'react-hook-form';

/**
 * @param options 문자열 리스트
 * @param showHelperText 도움말 텍스트 표시 여부
 * @param dataFormat 데이터 저장 형식 ('string' | 'object'), 그러나 CertificateItemSchema 형태로 저장되는 경우만 사용중
 */
interface Props {
  name: string;
  options: readonly string[];
  showHelperText?: boolean;
  dataFormat?: 'string' | 'object';
  max?: number;
}

const MultiOptionSelector = ({
  name,
  options,
  showHelperText = true,
  dataFormat = 'string',
  max,
}: Props) => {
  const { watch } = useFormContext();
  const selectedValues = watch(name) || [];
  //isMax의 타입이 boolean임을 확실하게 하기 위하여
  const isMax = max !== undefined && typeof max === 'number' && selectedValues.length >= max;

  return (
    <div className='flex flex-wrap gap-[1rem]'>
      {options.map((option) => {
        let isSelected = false;

        if (dataFormat === 'object' && Array.isArray(selectedValues) && selectedValues.length) {
          // selectedValues가 객체 배열인 경우 (CertificateItemSchema)
          isSelected = selectedValues.some((item) => {
            //객체고 내부에 type이 있는지
            if (typeof item === 'object' && item !== null && 'type' in item) {
              return item.type === option;
            } else {
              return item === option;
            }
          });
        } else {
          // selectedValues가 단순 문자열 배열인 경우
          isSelected = selectedValues.includes(option);
        }

        return (
          <Option
            key={option}
            name={name}
            value={option}
            isSelected={isSelected}
            dataFormat={dataFormat}
            isMax={isMax}
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
  isMax,
}: {
  name: string;
  value: string;
  isSelected: boolean;
  dataFormat: 'string' | 'object';
  isMax: boolean;
}) => {
  const { setValue, watch } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValues = watch(name) || [];

    if (e.target.checked) {
      if (isMax && !isSelected) {
        return;
      }
      if (dataFormat === 'object') {
        // TODO: 언젠간 고치자 꼭...
        const newItem = { type: value, certificateImageCreateRequest: null };
        setValue(name, [...currentValues, newItem], { shouldValidate: true, shouldDirty: true });
      } else {
        setValue(name, [...currentValues, value], { shouldValidate: true, shouldDirty: true });
      }
    } else {
      const filteredValues = currentValues.filter((item: unknown) => {
        if (dataFormat === 'object') {
          if (typeof item === 'object' && item !== null && 'type' in item) {
            return (item as { type: string }).type !== value;
          } else {
            return item !== value;
          }
        } else {
          return item !== value;
        }
      });
      setValue(name, filteredValues, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <label
      htmlFor={`${name}-${value}`}
      className={`flex rounded-[0.4rem] px-[1.6rem] py-[1rem] transition-all duration-200 ${
        isSelected
          ? 'bg-mint-5 border-mint-50 cursor-pointer border'
          : isMax
            ? 'border-stroke-neutral-dark cursor-not-allowed border opacity-50'
            : 'border-stroke-neutral-dark hover:border-mint-50 cursor-pointer border'
      } `}
      aria-disabled={!isSelected && isMax}>
      <div className='flex items-center gap-[0.8rem]'>
        <input
          type='checkbox'
          id={`${name}-${value}`}
          checked={isSelected}
          onChange={handleChange}
          className='sr-only'
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
