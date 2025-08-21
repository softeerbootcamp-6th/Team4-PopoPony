interface Props {
  label: string;
  text?: string;
}

const CompletedInfoRow = ({ label, text }: Props) => {
  return (
    <div className='flex-start gap-[0.8rem]'>
      <span className='text-text-neutral-primary body2-14-bold'>{label}</span>
      <div className='bg-stroke-black-opacity h-[1.2rem] w-[0.2rem] rounded-full' />
      <span className='text-text-neutral-secondary'>{text}</span>
    </div>
  );
};

export default CompletedInfoRow;
