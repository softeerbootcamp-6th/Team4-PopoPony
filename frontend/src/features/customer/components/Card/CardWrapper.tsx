import React from 'react';

type Props = {
  children: React.ReactNode;
};

const CardWrapper = ({ children }: Props) => {
  return <div className='bg-background-default-white rounded-[0.8rem] p-[1.2rem]'>{children}</div>;
};

const CardTitle = ({ title }: { title: string }) => {
  return <div className='body2-14-bold text-text-neutral-assistive mb-[1.2rem]'>{title}</div>;
};

CardWrapper.Title = CardTitle;

export default CardWrapper;
