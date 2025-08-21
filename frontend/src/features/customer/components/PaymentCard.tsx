import { Button, Divider } from '@components';
import { useMap } from '@hooks';
import type { components } from '@schema';
import type { TMapMarker } from '@types';
import { useEffect, useRef } from 'react';

interface Props {
  routeSimple: components['schemas']['RouteSimpleResponse'];
  usageFee: number;
  estimatedTaxiFare: number;
  onClick?: () => void;
}

const PaymentCard = ({ routeSimple, usageFee, estimatedTaxiFare, onClick }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { mapInstance, addRoutePolyline } = useMap(mapRef as React.RefObject<HTMLDivElement>);

  useEffect(() => {
    if (!mapInstance || !routeSimple) return;

    addRoutePolyline(routeSimple);
  }, [mapInstance, routeSimple]);

  const totalFee = usageFee + estimatedTaxiFare;
  return (
    <div className='bg-background-default-white flex-col-start shadow-card border-neutral-20 gap-[1.2rem] rounded-[1.2rem] border p-[1.6rem]'>
      <div
        className='bg-neutral-0 flex-center border-stroke-neutral-dark relative h-[17.3rem] w-full overflow-hidden rounded-[0.8rem] border'
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
        onWheel={(e) => e.preventDefault()}
        style={{ pointerEvents: 'none' }}>
        <div ref={mapRef} style={{ pointerEvents: 'none' }}></div>
      </div>
      <div className='w-full gap-[0.8rem]'>
        <h6 className='label2-14-medium text-text-mint-primary'>결제 진행</h6>
        <div className='flex-between mt-[0.4rem]'>
          <span className='body1-16-bold text-text-neutral-primary'>기본 이용요금(3시간)</span>
          <span className='body1-16-medium text-text-neutral-primary'>
            {usageFee.toLocaleString()}원
          </span>
        </div>
      </div>
      <Divider />
      <div className='mb-[0.8rem] w-full gap-[0.8rem]'>
        <h6 className='label2-14-medium text-text-mint-primary'>후불 결제</h6>
        <div className='flex-between mt-[0.4rem]'>
          <span className='body1-16-bold text-text-neutral-primary'>택시 이용요금(예상)</span>
          <span className='body1-16-medium text-text-neutral-primary'>
            {estimatedTaxiFare.toLocaleString()}원
          </span>
        </div>
        <div className='flex-between mt-[0.4rem]'>
          <span className='body1-16-bold text-text-neutral-primary'>예상 최종금액</span>
          <span className='body1-16-medium text-text-neutral-primary'>
            {totalFee.toLocaleString()}원
          </span>
        </div>
      </div>
      <Button onClick={onClick}>기본 요금 {usageFee.toLocaleString()}원 결제하기</Button>
    </div>
  );
};

export default PaymentCard;
