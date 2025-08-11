import { IcCheck } from '@icons';

interface Props {
  label: string;
  isChecked?: boolean;
  children: React.ReactNode;
  message?: string;
}

const LabeledSection = ({ label, isChecked = false, children, message }: Props) => {
  return (
    <section className='flex w-full flex-col gap-[0.8rem]'>
      <div className='flex items-center'>
        <h6 className='body1-16-bold text-neutral-90'>{label}</h6>
        {isChecked && <IcCheck className='[&_path]:stroke-mint-50' />}
      </div>
      <div>{children}</div>
      {!isChecked && message && <p className='body2-14-regular text-red-500'>{message}</p>}
    </section>
  );
};

export default LabeledSection;
