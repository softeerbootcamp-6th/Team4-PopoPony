import { IcCheckBox } from '@icons';

interface Props {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
}

const Checkbox = ({ label, checked, disabled, onChange = () => {} }: Props) => {
  const checkboxStyle = () => {
    if (disabled) {
      return {
        background: 'bg-neutral-15',
        iconColor: '[&_path]:fill-text-neutral-disabled',
        textColor: 'text-text-neutral-disabled',
      };
    }
    if (checked) {
      return {
        background: 'bg-mint-50',
        iconColor: '[&_path]:fill-neutral-0',
        textColor: 'text-text-neutral-secondary',
      };
    }
    return {
      background: 'bg-neutral-15',
      iconColor: '[&_path]:fill-neutral-0',
      textColor: 'text-text-neutral-disabled',
    };
  };
  const { background, iconColor, textColor } = checkboxStyle();

  return (
    <label
      htmlFor='checkbox'
      className={`${textColor} body2-14-medium flex-start cursor-pointer gap-[0.8rem]`}>
      <div className={`${background} flex-center h-[2.4rem] w-[2.4rem] rounded-[0.4rem]`}>
        <input
          id='checkbox'
          type='checkbox'
          className='hidden'
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
        {checked ? <IcCheckBox className={iconColor} /> : null}
      </div>
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
