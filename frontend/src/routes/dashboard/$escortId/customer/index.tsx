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

const { Tmapv3 } = window;

function RouteComponent() {
  const router = useRouter();
  const { escortId: recruitId } = Route.useParams();
  const { data } = getEscortDetail(Number(recruitId));
  const mapRef = useRef<HTMLDivElement>(null);
  const {
    mapInstance,
    addPolyline,
    setCurrentLocation,
    addMarker,
    addCustomMarker,
    resetPolyline,
  } = useMap(mapRef as React.RefObject<HTMLDivElement>);

  const { helperLocations, patientLocations, escortStatuses, connectionStatus } = useSSE(
    String(recruitId),
    'customer'
  );
  const currentStatus = escortStatuses?.escortStatus ?? '만남중';

  const patientMarker = useRef<TMapMarker>(null);
  const helperMarker = useRef<TMapMarker>(null);
  const meetingMarker = useRef<TMapMarker>(null);
  const hospitalMarker = useRef<TMapMarker>(null);
  const returnMarker = useRef<TMapMarker>(null);

  let { route, patient, helper, estimatedMeetingTime } = data.data;
  const {
    meetingLocationInfo,
    hospitalLocationInfo,
    returnLocationInfo,
    meetingToHospital,
    hospitalToReturn,
  } = route.routeSimple;
  const { name: patientName, imageUrl: patientImageUrl, contact: patientContact } = patient;
  const { name: helperName, imageUrl: helperImageUrl, contact: helperContact } = helper;

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
    patient,
    helper,
    isMeeting,
    isHospital,
    isReturn,
  }: {
    patient: boolean;
    helper: boolean;
    isMeeting: boolean;
    isHospital: boolean;
    isReturn: boolean;
  }) => {
    patientMarker.current?.setVisible(patient);
    helperMarker.current?.setVisible(helper);
    meetingMarker.current?.setVisible(isMeeting);
    hospitalMarker.current?.setVisible(isHospital);
    returnMarker.current?.setVisible(isReturn);
  };

  useEffect(() => {
    if (!mapInstance) return;
    console.log('바뀌었음');
    if (patientLocations?.latitude && patientLocations?.longitude) {
      console.log('patientLocations', patientLocations);
      patientMarker.current?.setPosition(
        new Tmapv3.LatLng(patientLocations.latitude, patientLocations.longitude)
      );
    }
    if (helperLocations?.latitude && helperLocations?.longitude) {
      console.log('helperLocations', helperLocations);
      helperMarker.current?.setPosition(
        new Tmapv3.LatLng(helperLocations.latitude, helperLocations.longitude)
      );
    }
  }, [
    patientLocations?.latitude,
    patientLocations?.longitude,
    helperLocations?.latitude,
    helperLocations?.longitude,
  ]);

  useEffect(() => {
    if (!mapInstance) return;
    resetPolyline();
    switch (currentStatus) {
      case '만남중':
        handleSetMarkerVisible({
          patient: true,
          helper: true,
          isMeeting: true,
          isHospital: false,
          isReturn: false,
        });
        break;
      case '병원행':
        handleSetMarkerVisible({
          patient: false,
          helper: true,
          isMeeting: true,
          isHospital: true,
          isReturn: false,
        });
        addPolyline(meetingToHospital, 'meetingToHospital');
        break;
      case '진료중':
        handleSetMarkerVisible({
          patient: false,
          helper: true,
          isMeeting: false,
          isHospital: true,
          isReturn: false,
        });
        break;
      case '복귀중':
        handleSetMarkerVisible({
          patient: false,
          helper: true,
          isMeeting: false,
          isHospital: true,
          isReturn: true,
        });
        addPolyline(hospitalToReturn, 'hospitalToReturn');
        break;
      default:
        break;
    }
  }, [currentStatus]);

  useEffect(() => {
    if (!mapInstance) return;

    // 고정 마커들 생성 (위치 정보가 있는 경우)
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

    // 초기에는 숨김 처리
    hospitalMarker.current?.setVisible(false);
    returnMarker.current?.setVisible(false);
  }, [mapInstance]);

  // 환자와 도우미 마커 생성/업데이트
  useEffect(() => {
    if (!mapInstance || !patientName || !patientImageUrl) return;

    // 환자 마커 생성 또는 업데이트
    if (patientLocations?.latitude && patientLocations?.longitude) {
      if (!patientMarker.current) {
        // 마커가 없으면 새로 생성
        patientMarker.current = addCustomMarker(
          patientLocations.latitude,
          patientLocations.longitude,
          `${patientName} 고객`,
          patientImageUrl
        );
      }
    }
  }, [
    mapInstance,
    patientLocations?.latitude,
    patientLocations?.longitude,
    patientName,
    patientImageUrl,
  ]);

  useEffect(() => {
    if (!mapInstance || !helperName || !helperImageUrl) return;

    // 도우미 마커 생성 또는 업데이트
    if (helperLocations?.latitude && helperLocations?.longitude) {
      if (!helperMarker.current) {
        // 마커가 없으면 새로 생성
        helperMarker.current = addCustomMarker(
          helperLocations.latitude,
          helperLocations.longitude,
          `${helperName} 도우미`,
          helperImageUrl
        );
      }
    }
  }, [
    mapInstance,
    helperLocations?.latitude,
    helperLocations?.longitude,
    helperName,
    helperImageUrl,
  ]);

  if (currentStatus === '리포트작성중') {
    return (
      <PageLayout>
        <PageLayout.Header showClose={true} onClose={() => router.history.back()} />
        <PageLayout.Content>
          <WritingReport />
        </PageLayout.Content>
        <PageLayout.Footer>
          <Footer
            escortStatus={currentStatus as EscortStatusProps}
            handleClickGoToReport={handleClickGoToReport}
            handleClickCallHelper={handleClickCallHelper}
            handleClickGoToCustomerCenter={handleClickGoToCustomerCenter}
          />
        </PageLayout.Footer>
      </PageLayout>
    );
  }

  if (currentStatus === '동행완료') {
    return (
      <PageLayout>
        <PageLayout.Header showClose={true} onClose={() => router.history.back()} />
        <PageLayout.Content>
          <EscortCompleted />
        </PageLayout.Content>
        <PageLayout.Footer>
          <Footer
            escortStatus={currentStatus as EscortStatusProps}
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
            escortStatus={currentStatus as StatusTitleProps}
            time={estimatedMeetingTime}
            route={route.routeSimple}
          />
        </div>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Footer
          escortStatus={currentStatus as EscortStatusProps}
          handleClickGoToReport={handleClickGoToReport}
          handleClickCallHelper={handleClickCallHelper}
          handleClickGoToCustomerCenter={handleClickGoToCustomerCenter}
        />
      </PageLayout.Footer>
    </PageLayout>
  );
}
