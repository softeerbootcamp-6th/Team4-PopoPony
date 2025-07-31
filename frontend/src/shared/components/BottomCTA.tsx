import React from 'react';

export interface BottomCTAProps {
  children: React.ReactNode;
}

const BottomCTA = ({ children }: BottomCTAProps) => {
  return (
    <div className='bg-background-default-white px-[2rem] pt-[1.2rem] pb-[1.6rem]'>{children}</div>
  );
};

export default BottomCTA;
