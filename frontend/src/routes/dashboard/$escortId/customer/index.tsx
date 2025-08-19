import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { getEscortDetail } from '@dashboard/apis';
import { PageLayout } from '@layouts';
import { type StatusTitleProps, type EscortStatusProps } from '@dashboard/types';
import { $api } from '@apis';
import {
  Header,
  EscortCompleted,
  WritingReport,
  CustomerDashboardLive,
  Footer,
} from '@dashboard/components';
import { useEffect, useRef, useState } from 'react';
import { useMap } from '@hooks';
import { FloatingButton } from '@components';
import type { TMapMarker } from '@types';
import { useSSE } from '@dashboard/hooks';

export const Route = createFileRoute('/dashboard/$escortId/customer/')({
  beforeLoad: async ({ context, params }) => {
    const { queryClient } = context;
    const recruitId = Number(params.escortId);

    const escortDetailOpts = $api.queryOptions('get', '/api/escorts/recruits/{recruitId}', {
      params: { path: { recruitId } },
    });

    const escortDetail = await queryClient.ensureQueryData(escortDetailOpts);

    // if (escortDetail.data.escortStatus === '동행준비') {
    //   throw redirect({
    //     to: '/dashboard/$escortId/customer/prepare',
    //     params: { escortId: String(recruitId) },
    //   });
    // }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { escortId: recruitId } = Route.useParams();
  const { data } = getEscortDetail(Number(recruitId));
  const mapRef = useRef<HTMLDivElement>(null);
  const { mapInstance, addPolyline, setCurrentLocation, addMarker, resetPolyline } = useMap(
    mapRef as React.RefObject<HTMLDivElement>
  );

  const { helperLocations, patientLocations, escortStatuses, connectionStatus } = useSSE(
    String(recruitId),
    'patient'
  );
  console.log('helperLocations', helperLocations);
  console.log('patientLocations', patientLocations);
  console.log('escortStatuses', escortStatuses);
  console.log('connectionStatus', connectionStatus);

  const meetingMarker = useRef<TMapMarker>(null);
  const hospitalMarker = useRef<TMapMarker>(null);
  const returnMarker = useRef<TMapMarker>(null);

  const [escortStatus, setEscortStatus] = useState<EscortStatusProps>('만남중');

  let { route, helper, estimatedMeetingTime } = data.data;
  const {
    meetingLocationInfo,
    hospitalLocationInfo,
    returnLocationInfo,
    meetingToHospital,
    hospitalToReturn,
  } = route.routeSimple;
  const helperContact = helper.contact;

  const handleClickCallHelper = () => {
    window.open(`tel:${helperContact}`, '_blank');
  };
  const handleClickGoToCustomerCenter = () => {
    window.open(`tel:010-2514-9058`, '_blank');
  };
  const handleClickGoToReport = () => {
    router.navigate({
      to: '/customer/escort/$escortId',
      params: {
        escortId: String(recruitId),
      },
    });
  };

  const handleSetMarkerVisible = ({
    isMeeting,
    isHospital,
    isReturn,
  }: {
    isMeeting: boolean;
    isHospital: boolean;
    isReturn: boolean;
  }) => {
    meetingMarker.current?.setVisible(isMeeting);
    hospitalMarker.current?.setVisible(isHospital);
    returnMarker.current?.setVisible(isReturn);
  };

  useEffect(() => {
    if (!mapInstance) return;

    resetPolyline();
    switch (escortStatus) {
      case '만남중':
        handleSetMarkerVisible({ isMeeting: true, isHospital: false, isReturn: false });
        break;
      case '병원행':
        handleSetMarkerVisible({ isMeeting: true, isHospital: true, isReturn: false });
        addPolyline(meetingToHospital, 'meetingToHospital');
        break;
      case '진료중':
        handleSetMarkerVisible({ isMeeting: false, isHospital: true, isReturn: false });
        break;
      case '복귀중':
        handleSetMarkerVisible({ isMeeting: false, isHospital: true, isReturn: true });
        addPolyline(hospitalToReturn, 'hospitalToReturn');
        break;
      default:
        break;
    }
  }, [escortStatus]);

  useEffect(() => {
    if (!mapInstance) return;

    meetingMarker.current = addMarker(
      meetingLocationInfo.lat,
      meetingLocationInfo.lon,
      'home',
      meetingLocationInfo.placeName
    );
    hospitalMarker.current = addMarker(
      hospitalLocationInfo.lat,
      hospitalLocationInfo.lon,
      'hospital',
      hospitalLocationInfo.placeName
    );
    returnMarker.current = addMarker(
      returnLocationInfo.lat,
      returnLocationInfo.lon,
      'home',
      returnLocationInfo.placeName
    );

    hospitalMarker.current?.setVisible(false);
    returnMarker.current?.setVisible(false);
  }, [mapInstance]);

  if (escortStatus === '리포트작성중') {
    return (
      <PageLayout>
        <PageLayout.Header showClose={true} onClose={() => router.history.back()} />
        <PageLayout.Content>
          <WritingReport />
        </PageLayout.Content>
        <PageLayout.Footer>
          <Footer
            escortStatus={escortStatus as EscortStatusProps}
            handleClickGoToReport={handleClickGoToReport}
            handleClickCallHelper={handleClickCallHelper}
            handleClickGoToCustomerCenter={handleClickGoToCustomerCenter}
          />
        </PageLayout.Footer>
      </PageLayout>
    );
  }

  if (escortStatus === '동행완료') {
    return (
      <PageLayout>
        <PageLayout.Header showClose={true} onClose={() => router.history.back()} />
        <PageLayout.Content>
          <EscortCompleted />
        </PageLayout.Content>
        <PageLayout.Footer>
          <Footer
            escortStatus={escortStatus as EscortStatusProps}
            handleClickGoToReport={handleClickGoToReport}
            handleClickCallHelper={handleClickCallHelper}
            handleClickGoToCustomerCenter={handleClickGoToCustomerCenter}
          />
        </PageLayout.Footer>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Header updateBefore={10} />
      <PageLayout.Content>
        <div className='flex h-full flex-col'>
          {/* 지도 */}
          <div className='bg-background-default-white2 flex-center relative h-[27rem] w-full'>
            <div ref={mapRef}></div>
            <FloatingButton onClick={() => router.history.back()} />
            <FloatingButton
              icon='current'
              position='bottom-left'
              onClick={() => setCurrentLocation()}
            />
          </div>
          <div className='flex-center gap-[1.2rem]'>
            <button
              className='border-b-stroke-neutral-dark rounded-md border px-[0.8rem] py-[0.4rem]'
              onClick={() => setEscortStatus('만남중')}>
              만남중
            </button>
            <button
              className='border-b-stroke-neutral-dark rounded-md border px-[0.8rem] py-[0.4rem]'
              onClick={() => setEscortStatus('병원행')}>
              병원행
            </button>
            <button
              className='border-b-stroke-neutral-dark rounded-md border px-[0.8rem] py-[0.4rem]'
              onClick={() => setEscortStatus('진료중')}>
              진료중
            </button>
            <button
              className='border-b-stroke-neutral-dark rounded-md border px-[0.8rem] py-[0.4rem]'
              onClick={() => setEscortStatus('복귀중')}>
              복귀중
            </button>
          </div>
          <CustomerDashboardLive
            escortStatus={escortStatus as StatusTitleProps}
            time={estimatedMeetingTime}
            route={route.routeSimple}
          />
        </div>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Footer
          escortStatus={escortStatus as EscortStatusProps}
          handleClickGoToReport={handleClickGoToReport}
          handleClickCallHelper={handleClickCallHelper}
          handleClickGoToCustomerCenter={handleClickGoToCustomerCenter}
        />
      </PageLayout.Footer>
    </PageLayout>
  );
}
