import { Button, Checkbox, ShowMapButton } from '@components';
import { IcChevronDown } from '@icons';
import { useState } from 'react';

const routeData = {
  meetingPlace: {
    location: '정문 앞',
    roadAddress: '도로명주소영역',
    businessAddress: '상호명주소영역',
  },
  hospital: {
    location: '3층 내분비내과',
    roadAddress: '서울특별시 중구 을지로 100',
    businessAddress: '병원명',
  },
  arrivalPlace: {
    location: '정문 앞',
    roadAddress: '도로명주소영역',
    businessAddress: '상호명주소영역',
  },
};

const titleMap = {
  meetingPlace: '만남 장소',
  hospital: '병원',
  arrivalPlace: '도착 장소',
};

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

const RouteButton = () => {
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
              {Object.entries(routeData).map(([key, value]) => (
                <div key={key} className='relative'>
                  <div>
                    <Dot active={true} />
                    <h6 className='body2-14-bold text-text-neutral-secondary ml-[2.8rem]'>
                      {titleMap[key as keyof typeof titleMap]}
                    </h6>
                    {key !== 'arrivalPlace' && (
                      <div className='bg-stroke-neutral-dark absolute top-[1rem] left-[0.8rem] h-[calc(100%+2rem)] w-[0.4rem]' />
                    )}
                  </div>
                  <div className='ml-[2.8rem] flex flex-col'>
                    <h5 className='subtitle-18-medium text-text-neutral-primary mt-[0.8rem] mb-[0.4rem]'>
                      {value.location}
                    </h5>
                    <ShowMapButton
                      roadAddress={value.roadAddress}
                      businessAddress={value.businessAddress}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-[0.8rem] ml-[2.8rem]'>
              <Checkbox label='만남 장소와 복귀 장소가 동일해요' checked={true} disabled={true} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RouteButton;
