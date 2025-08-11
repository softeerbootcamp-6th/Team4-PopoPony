import { IcAlertCircle } from '@icons';

interface Props {
  text: string;
}

const WarningBox = ({ text }: Props) => {
  return (
    <div className='flex-start bg-background-light-red gap-[0.8rem] rounded-[0.6rem] p-[1rem]'>
      <IcAlertCircle className='[&_path]:fill-icon-red-primary' width={16} height={16} />
      <span className='caption1-12-medium text-text-red-primary'>{text}</span>
    </div>
  );
};

export default WarningBox;
