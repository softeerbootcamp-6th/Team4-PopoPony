import { ShowMapButton } from '@components';
import { getEscortDetail } from '@dashboard/apis';
import { IcMarker1, IcMarker2, IcMarker3, IcPinFillEffect, IcTaxiBadge } from '@icons';
import { PageLayout } from '@layouts';
import { createFileRoute } from '@tanstack/react-router';
import { dateFormat } from '@utils';
import { useMemo } from 'react';

export const Route = createFileRoute('/dashboard/$escortId/helper/prepare')({
  component: RouteComponent,
});

interface PlaceInfoProps {
  sequence: number;
  placeName: string;
  address: string;
  detailAddress: string;
}

const PlaceInfo = ({ sequence, placeName, address, detailAddress }: PlaceInfoProps) => {
  const marker = useMemo(() => {
    switch (sequence) {
      case 1:
        return <IcMarker1 />;
      case 2:
        return <IcMarker2 />;
      case 3:
        return <IcMarker3 />;
    }
  }, [sequence]);

  return (
    <div className='flex gap-[1.2rem]'>
      {marker}
      <div className='flex flex-col gap-[0.4rem]'>
        <p className='subtitle-18-medium text-text-neutral-primary'>{placeName}</p>
        <ShowMapButton roadAddress={address} businessAddress={detailAddress} />
      </div>
    </div>
  );
};

interface TaxiInfoProps {
  time: number;
  price: number;
}

const TaxiInfo = ({ time, price }: TaxiInfoProps) => {
  return (
    <div className='flex gap-[1.2rem]'>
      <div className='flex-col-start gap-[0.8rem]'>
        <IcTaxiBadge width={24} height={24} className='min-h-[2.4rem] min-w-[2.4rem]' />
        <div className='border-stroke-neutral-dark h-full w-[0.1rem] border border-dashed' />
      </div>
      <div className='flex flex-col gap-[0.8rem]'>
        <p className='subtitle-18-bold text-text-neutral-primary'>택시 탑승</p>
        <div className='body1-16-medium text-text-neutral-primary flex flex-col gap-[0.4rem]'>
          <div className='flex-start gap-[2rem]'>
            <p className='text-text-neutral-assistive w-[9rem]'>예상 소요시간</p>
            <p>{minutesToTime(time)}</p>
          </div>
          <div className='flex-start gap-[2rem]'>
            <p className='text-text-neutral-assistive w-[9rem]'>예상 금액</p>
            <p>{price.toLocaleString()}원</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}시간 ${remainingMinutes}분`;
};

function RouteComponent() {
  const { escortId } = Route.useParams();
  const { data } = getEscortDetail(Number(escortId));
  const escortDetail = data?.data;

  const { imageUrl, name } = escortDetail?.patient ?? {};
  const { meetingLocationInfo, hospitalLocationInfo, returnLocationInfo } =
    escortDetail?.route.routeSimple ?? {};

  // TODO 이거 어떻게 하기로 했더라
  if (!escortDetail) return <div>Loading...</div>;

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
        <div className='relative z-10 mx-[2rem] flex flex-col gap-[2.8rem]'>
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

          <div>
            <div className='bg-neutral-10 flex-center h-[17.3rem] w-full rounded-[0.8rem]'>
              지도
            </div>
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
