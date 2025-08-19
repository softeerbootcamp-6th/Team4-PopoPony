interface Props {
  status: 'good' | 'average' | 'bad';
  date?: string;
  content: string;
}

const ReviewCard = ({ status, date, content }: Props) => {
  return (
    <article className='shadow-card border-stroke-neutral-dark flex w-[24rem] min-w-[24rem] flex-col rounded-[1.2rem] border px-[1.6rem] py-[1.2rem]'>
      <div>
        <img
          src={`/images/status-${status}.svg`}
          alt={`status-${status}`}
          className='h-[3.6rem] w-[3.6rem]'
        />
      </div>
      {date && (
        <div className='label2-14-medium text-text-neutral-secondary mt-[1.2rem]'>{date}</div>
      )}
      <div className='body1-16-medium text-text-neutral-primary mt-[0.4rem]'>{content}</div>
    </article>
  );
};

export default ReviewCard;
