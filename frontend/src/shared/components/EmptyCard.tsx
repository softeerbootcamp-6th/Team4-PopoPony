const EmptyCard = ({ text }: { text: string }) => {
  return (
    <div className='flex-center border-stroke-neutral-dark h-[12rem] w-full rounded-[0.8rem] border'>
      <span className='body1-16-medium text-text-neutral-assistive'>{text}</span>
    </div>
  );
};

export default EmptyCard;
