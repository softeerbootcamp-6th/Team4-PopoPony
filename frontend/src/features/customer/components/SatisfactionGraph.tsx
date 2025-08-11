interface Props {
  goodRate: number;
  averageRate: number;
  badRate: number;
}

const SatisfactionGraph = ({ goodRate, averageRate, badRate }: Props) => {
  const satisfactionData = [
    {
      label: '추천해요',
      rate: goodRate,
      color: 'bg-mint-50',
      icon: '/images/status-good.svg',
      alt: 'good',
    },
    {
      label: '괜찮아요',
      rate: averageRate,
      color: 'bg-yellow-50',
      icon: '/images/status-average.svg',
      alt: 'average',
    },
    {
      label: '아쉬워요',
      rate: badRate,
      color: 'bg-red-50',
      icon: '/images/status-bad.svg',
      alt: 'bad',
    },
  ];

  return (
    <div className='shadow-card body2-14-bold text-text-neutral-primary flex-col-center w-full gap-[0.4rem] p-[1rem]'>
      {satisfactionData.map((item, index) => (
        <div key={index} className='flex-between h-[2.4rem] w-full gap-[1.6rem]'>
          <span>{item.label}</span>
          {item.color && item.icon ? (
            <div className='relative flex h-full flex-1 items-center'>
              <div className='bg-neutral-20 absolute top-1/2 h-[0.8rem] w-full -translate-y-1/2 rounded-full'></div>
              {item.rate > 0 && (
                <>
                  <div
                    className={`${item.color} absolute top-1/2 left-0 h-[0.8rem] -translate-y-1/2 rounded-full`}
                    style={{ width: `${item.rate}%` }}></div>
                  <img
                    src={item.icon}
                    alt={item.alt}
                    className='absolute top-1/2 h-[2.4rem] w-[2.4rem] -translate-x-1/2 -translate-y-1/2'
                    style={{ left: `${item.rate}%` }}
                  />
                </>
              )}
            </div>
          ) : (
            <div className='flex h-full flex-1 items-center'></div>
          )}
          <span className='w-[4rem] min-w-[4rem] text-left'>{item.rate}%</span>
        </div>
      ))}
    </div>
  );
};

export default SatisfactionGraph;
