import { IcCheck } from '@icons';

interface Props {
  label: string;
  isChecked?: boolean;
  children: React.ReactNode;
}

const LabeledSection = ({ label, isChecked = false, children }: Props) => {
  return (
    <section className='flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <h6 className='body1-16-bold text-neutral-90'>{label}</h6>
        <IcCheck className={`[&_path]:stroke-${isChecked ? 'mint-50' : 'neutral-90'}`} />
      </div>
      <div>{children}</div>
    </section>
  );
};

export default LabeledSection;
