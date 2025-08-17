interface Props {
  text: string;
  count: number;
}

const KeywordTag = ({ text, count }: Props) => {
  return (
    <div className='flex-start bg-neutral-10 body1-16-bold h-[3.2rem] w-fit gap-[0.4rem] rounded-[0.4rem] px-[0.8rem] py-[0.4rem]'>
      <span className='text-text-neutral-secondary'>{text}</span>
      <span className='text-text-mint-on-primary'>{count}</span>
    </div>
  );
};

export default KeywordTag;
