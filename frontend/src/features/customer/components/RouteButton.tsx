import { Button, ShowMapButton } from '@components';
import { IcChevronDown } from '@icons';
import { useState } from 'react';
import type { LocationInfoSimpleResponse } from '@customer/types';

const titleMap = ['만남장소', '병원', '도착장소'];

const Dot = ({ active }: { active: boolean }) => {
  return (
    <div
      className={`${active ? 'bg-mint-10' : 'bg-neutral-20'} flex-center absolute z-10 h-[2rem] w-[2rem] rounded-full`}>
      <div
        className={`${active ? 'bg-mint-50' : 'bg-neutral-60'} h-[1rem] w-[1rem] rounded-full`}
      />
    </div>
  );
};

const RouteButton = ({ LocationData }: { LocationData: LocationInfoSimpleResponse[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`${isOpen ? 'shadow-card' : ''}`}>
      <Button variant='assistive' onClick={handleClick}>
        <span>동행 경로 보기</span>
        <div className={`${isOpen ? 'rotate-180' : ''}`}>
          <IcChevronDown />
        </div>
      </Button>
      {isOpen && (
        <>
          <div className='bg-background-light-neutral border-stroke-neutral-dark w-full rounded-[0.4rem] border-r border-b border-l py-[2rem] pr-[2rem] pl-[1.2rem]'>
            <div className='flex flex-col gap-[2rem]'>
              {LocationData.map((value, index) => (
                <div key={titleMap[index]} className='relative'>
                  <div>
                    <Dot active={true} />
                    <h6 className='body2-14-bold text-text-neutral-secondary ml-[2.8rem]'>
                      {titleMap[index]}
                    </h6>
                    {index !== 2 && (
                      <div className='bg-stroke-neutral-dark absolute top-[1rem] left-[0.8rem] h-[calc(100%+2rem)] w-[0.4rem]' />
                    )}
                  </div>
                  <div className='ml-[2.8rem] flex flex-col'>
                    <h5 className='subtitle-18-medium text-text-neutral-primary mt-[0.8rem] mb-[0.4rem]'>
                      {value.detailAddress}
                    </h5>
                    <ShowMapButton roadAddress={value.address} businessAddress={value.placeName} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RouteButton;
