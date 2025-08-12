import React from 'react';

interface StatsSummaryCardProps {
  count: number;
  recommendRate: number;
  reviewCount: number;
}

const StatsSummaryCard = ({ count, recommendRate, reviewCount }: StatsSummaryCardProps) => {
  const stats = [
    { value: `${count}명`, label: '총 동행자' },
    { value: `${recommendRate}%`, label: '추천해요' },
    { value: `${reviewCount}건`, label: '동행 후기' },
  ];

  return (
    <div className='border-stroke-neutral-dark bg-neutral-5 flex h-[7.9rem] items-center justify-evenly rounded-lg border py-[2.15rem]'>
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <div className='flex h-full items-center'>
            <div className='flex-col-center gap-[0.4rem]'>
              <div className='subtitle-18-bold text-text-neutral-primary'>{stat.value}</div>
              <div className='label2-14-medium text-text-neutral-secondary'>{stat.label}</div>
            </div>
          </div>
          {index < stats.length - 1 && <div className='bg-stroke-neutral-dark h-full w-[0.2rem]' />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatsSummaryCard;
