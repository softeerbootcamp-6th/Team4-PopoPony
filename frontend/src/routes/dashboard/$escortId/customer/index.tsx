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
import { useEffect, useRef } from 'react';
import { useMap } from '@hooks';
import { FloatingButton } from '@components';

export const Route = createFileRoute('/dashboard/$escortId/customer/')({
  beforeLoad: async ({ context, params }) => {
    const { queryClient } = context;
    const recruitId = Number(params.escortId);

    const escortDetailOpts = $api.queryOptions('get', '/api/escorts/recruits/{recruitId}', {
      params: { path: { recruitId } },
    });

    const escortDetail = await queryClient.ensureQueryData(escortDetailOpts);

    if (escortDetail.data.escortStatus === '동행준비') {
      throw redirect({
        to: '/dashboard/$escortId/customer/prepare',
        params: { escortId: String(recruitId) },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { escortId: recruitId } = Route.useParams();
  const { data } = getEscortDetail(Number(recruitId));
  const mapRef = useRef<HTMLDivElement>(null);
  const {
    mapInstance,
    isTmapLoaded,
    addPolyline,
    addUserLocationMarker,
    setCurrentLocation,
    addMarker,
  } = useMap(mapRef as React.RefObject<HTMLDivElement>);
  let { escortStatus, route, helper, estimatedMeetingTime } = data.data;
  const { meetingLocationInfo } = route.routeSimple;
  const helperContact = helper.contact;

  escortStatus = '병원행';

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

  useEffect(() => {
    if (mapInstance) {
      addMarker(
        meetingLocationInfo.lat,
        meetingLocationInfo.lon,
        'home',
        meetingLocationInfo.placeName
      );
    }
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
