interface Props {
  icon?: React.ReactNode;
  text: string;
}

const Tag = ({ icon, text }: Props) => {
  return (
    <div className='flex-start bg-neutral-10 w-fit gap-[0.4rem] rounded-[0.4rem] py-[0.4rem] pr-[0.8rem] pl-[0.4rem]'>
      {icon}
      <span className='label3-12-medium text-text-neutral-primary'>{text}</span>
    </div>
  );
};

export default Tag;
