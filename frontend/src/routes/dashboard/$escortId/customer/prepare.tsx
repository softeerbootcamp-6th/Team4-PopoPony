import { getEscortDetail } from '@dashboard/apis';
import { useMap } from '@shared/hooks';
import { IcArrowLeft, IcPinFillEffect } from '@icons';
import { PageLayout } from '@shared/layouts';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import {
  dateFormat,
  timeFormatTo24Hour,
  getRemainingDayOrHour,
  getDifferenceInSecondsFromNow,
} from '@shared/utils';
import { useEffect, useRef } from 'react';
import type { components } from '@schema';
import { PlaceInfo, TaxiInfo } from '@dashboard/components';
export const Route = createFileRoute('/dashboard/$escortId/customer/prepare')({
  component: RouteComponent,
});

const ThreeHoursInMs = 1000 * 60 * 60 * 3;

type EscortDetailResponse = components['schemas']['EscortDetailResponse'];

function RouteComponent() {
  const router = useRouter();
  const { escortId } = Route.useParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const { mapInstance, isTmapLoaded, addRoutePolyline } = useMap(
    mapRef as React.RefObject<HTMLDivElement>
  );

  const { data } = getEscortDetail(Number(escortId));
  const escortDetail = data?.data as EscortDetailResponse;

  const { imageUrl, name } = escortDetail?.helper ?? {};
  const { routeSimple: route } = escortDetail.route;

  const diff = getDifferenceInSecondsFromNow(escortDetail.escortDate);
  const { meetingLocationInfo, hospitalLocationInfo, returnLocationInfo } = route;

  useEffect(() => {
    //동행 시작 3시간 전에 자동 리다이렉트
    const delayMs = Math.max(0, (diff - 3) * 1000 - ThreeHoursInMs);
    const id = setTimeout(() => {
      router.navigate({
        to: '/dashboard/$escortId/customer',
        params: { escortId: escortId },
      });
    }, delayMs);
    return () => clearTimeout(id);
  }, [diff, escortId, router]);

  const isSameStartEnd =
    meetingLocationInfo.lat === returnLocationInfo.lat &&
    meetingLocationInfo.lon === returnLocationInfo.lon;

  useEffect(() => {
    if (!mapInstance) return;

    addRoutePolyline(escortDetail.route);
  }, [mapInstance]);

  if (!isTmapLoaded) return <div>Loading...</div>;

  return (
    <>
      <div className='flex-start mb-[2.4rem] h-[5.6rem] w-full px-[2rem]'>
        <button
          type='button'
          onClick={() => router.history.back()}
          className='flex-center text-text-neutral-primary absolute z-10'
          aria-label='뒤로 가기'>
          <IcArrowLeft className='h-[2.4rem] w-[2.4rem]' />
        </button>
      </div>
      <PageLayout.Content>
        <img
          src='/images/dashboard-background.png'
          alt='home'
          className='absolute top-[-5.6rem] left-0 z-0 w-full'
        />
        <div className='relative z-10 mx-[2rem] flex flex-col gap-[2.8rem] pb-[4rem]'>
          <div className='flex-between'>
            <div className='flex flex-col gap-[0.4rem]'>
              <p className='body1-16-medium text-text-neutral-primary'>
                {name} 도우미와의 동행까지
              </p>
              <p className='text-text-neutral-primary display-32-bold'>
                <strong className='text-text-mint-on-primary'>
                  {getRemainingDayOrHour(escortDetail.escortDate)}
                </strong>{' '}
                남았어요!
              </p>
            </div>
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${imageUrl}`}
              alt='patient'
              className='aspect-square w-[8.2rem] rounded-full object-cover'
            />
          </div>

          <div className='bg-background-light-mint flex flex-col gap-[0.4rem] rounded-[0.6rem] px-[1.2rem] py-[1rem]'>
            <p className='body2-14-medium text-text-neutral-secondary'>동행 예정 시간</p>
            <div className='flex-start gap-[0.8rem]'>
              <IcPinFillEffect />
              <p className='subtitle-18-bold text-text-neutral-primary flex flex-wrap gap-x-[0.4rem]'>
                <span>{dateFormat(escortDetail!.escortDate, 'yyyy년 MM월 dd일')}</span>
                <span>
                  {timeFormatTo24Hour(escortDetail.estimatedMeetingTime)} ~{' '}
                  {timeFormatTo24Hour(escortDetail.estimatedReturnTime)}
                </span>
              </p>
            </div>
          </div>

          <div className='aspect-video w-full rounded-[0.8rem] border-2 border-gray-300 bg-gray-100'>
            <div ref={mapRef}></div>
          </div>

          <div className='flex flex-col gap-[3.6rem]'>
            <PlaceInfo
              sequence={1}
              placeName={meetingLocationInfo?.placeName ?? ''}
              address={meetingLocationInfo?.address ?? ''}
              detailAddress={meetingLocationInfo?.detailAddress ?? ''}
              pos={{ lat: meetingLocationInfo?.lat, lon: meetingLocationInfo?.lon }}
            />
            <TaxiInfo
              time={escortDetail.route.meetingToHospitalEstimatedTime}
              price={escortDetail.route.meetingToHospitalEstimatedTaxiFee}
            />
            <PlaceInfo
              sequence={2}
              placeName={hospitalLocationInfo?.placeName ?? ''}
              address={hospitalLocationInfo?.address ?? ''}
              detailAddress={hospitalLocationInfo?.detailAddress ?? ''}
              pos={{ lat: hospitalLocationInfo?.lat, lon: hospitalLocationInfo?.lon }}
            />
            <TaxiInfo
              time={escortDetail.route.hospitalToReturnEstimatedTime}
              price={escortDetail.route.hospitalToReturnEstimatedTaxiFee}
            />
            <PlaceInfo
              sequence={isSameStartEnd ? 1 : 3}
              placeName={returnLocationInfo?.placeName ?? ''}
              address={returnLocationInfo?.address ?? ''}
              detailAddress={returnLocationInfo?.detailAddress ?? ''}
              pos={{ lat: returnLocationInfo?.lat, lon: returnLocationInfo?.lon }}
            />
          </div>
        </div>
      </PageLayout.Content>
    </>
  );
}
