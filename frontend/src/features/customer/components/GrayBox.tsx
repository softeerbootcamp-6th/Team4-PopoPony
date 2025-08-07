interface Props {
  children: React.ReactNode;
}

const GrayBox = ({ children }: Props) => {
  return (
    <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary rounded-[0.6rem] p-[1rem]'>
      {children}
    </div>
  );
};

export default GrayBox;
