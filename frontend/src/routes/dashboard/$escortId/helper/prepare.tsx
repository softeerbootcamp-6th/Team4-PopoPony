import { getEscortDetail } from '@dashboard/apis';
import { useMap } from '@hooks';
import { IcPinFillEffect } from '@icons';
import { PageLayout } from '@layouts';
import { createFileRoute } from '@tanstack/react-router';
import { dateFormat } from '@utils';
import { useEffect, useRef } from 'react';
import type { components } from '@schema';
import { PlaceInfo, TaxiInfo } from '@dashboard/components';

export const Route = createFileRoute('/dashboard/$escortId/helper/prepare')({
  component: RouteComponent,
});

type EscortDetailResponse = components['schemas']['EscortDetailResponse'];

function RouteComponent() {
  const { escortId } = Route.useParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const { mapInstance, isTmapLoaded, addPolyline } = useMap(
    mapRef as React.RefObject<HTMLDivElement>
  );

  const { data } = getEscortDetail(Number(escortId));
  const escortDetail = data?.data as EscortDetailResponse;

  const { imageUrl, name } = escortDetail?.patient ?? {};
  const {
    meetingLocationInfo,
    hospitalLocationInfo,
    returnLocationInfo,
    meetingToHospital,
    hospitalToReturn,
  } = escortDetail?.route.routeSimple ?? {};

  useEffect(() => {
    if (!mapInstance) return;

    addPolyline([
      {
        startMarkerType: 'marker1',
        endMarkerType: 'marker2',
        pathCoordinates: JSON.parse(meetingToHospital),
      },
      {
        startMarkerType: 'marker2',
        endMarkerType: 'marker3',
        pathCoordinates: JSON.parse(hospitalToReturn),
      },
    ]);
  }, [mapInstance]);

  // TODO 이거 어떻게 하기로 했더라
  if (!isTmapLoaded) return <div>Loading...</div>;

  const timeLeft = () => {
    const now = new Date();
    const escortDate = new Date(escortDetail.escortDate);
    const timeDiff = escortDate.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <PageLayout>
      <PageLayout.Header showBack={true} background={false} />
      <PageLayout.Content>
        <img
          src='/images/dashboard-background.png'
          alt='home'
          className='absolute top-[-5.6rem] left-0 z-0 w-full'
        />
        <div className='relative z-10 mx-[2rem] flex flex-col gap-[2.8rem] pb-[4rem]'>
          <div className='flex-between'>
            <div className='flex flex-col gap-[0.4rem]'>
              <p className='body1-16-medium text-text-neutral-primary'>{name} 환자와의 동행까지</p>
              <p className='text-text-neutral-primary display-32-bold'>
                <strong className='text-text-mint-on-primary'>{timeLeft()}일</strong> 남았어요!
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
            <div className='flex-start gap-[0.4rem]'>
              <IcPinFillEffect />
              <p className='subtitle-18-bold text-text-neutral-primary'>
                {`${dateFormat(escortDetail!.escortDate, 'yyyy년 MM월 dd일')} ${escortDetail.estimatedMeetingTime} ~ ${escortDetail.estimatedReturnTime}`}
              </p>
            </div>
          </div>

          <div className='h-[17.3rem] w-full rounded-[0.8rem] border-2 border-gray-300 bg-gray-100'>
            <div ref={mapRef}></div>
          </div>

          <div className='flex flex-col gap-[3.6rem]'>
            <PlaceInfo
              sequence={1}
              placeName={meetingLocationInfo?.placeName ?? ''}
              address={meetingLocationInfo?.address ?? ''}
              detailAddress={meetingLocationInfo?.detailAddress ?? ''}
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
            />
            <TaxiInfo
              time={escortDetail.route.hospitalToReturnEstimatedTime}
              price={escortDetail.route.hospitalToReturnEstimatedTaxiFee}
            />
            <PlaceInfo
              sequence={3}
              placeName={returnLocationInfo?.placeName ?? ''}
              address={returnLocationInfo?.address ?? ''}
              detailAddress={returnLocationInfo?.detailAddress ?? ''}
            />
          </div>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
