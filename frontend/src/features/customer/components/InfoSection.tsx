interface Props {
  title: string;
  status?: string;
  children: React.ReactNode;
}

const InfoSection = ({ title, status, children }: Props) => {
  return (
    <section className='flex flex-col gap-[0.8rem]'>
      <div className='flex-start gap-[0.6rem]'>
        <h4 className='body2-14-medium text-text-neutral-secondary'>{title}</h4>
        <span className='body1-16-bold text-text-neutral-primary'>{status}</span>
      </div>
      {children}
    </section>
  );
};

export default InfoSection;
