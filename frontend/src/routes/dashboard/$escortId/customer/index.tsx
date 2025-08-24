import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';

import { useEffect, useRef } from 'react';

import { $api } from '@shared/api';
import { useMap } from '@shared/hooks';
import { call } from '@shared/lib';
import type { TMapMarker } from '@shared/types';
import { PageLayout } from '@shared/ui/layout';

import { getEscortDetail } from '@dashboard/apis';
import {
  CustomerDashboardLive,
  EscortCompleted,
  Footer,
  Header,
  WritingReport,
} from '@dashboard/components';
import { useSocket } from '@dashboard/hooks';
import { type EscortStatusProps, type StatusTitleProps } from '@dashboard/types';

import { updatedBefore } from '@helper/utils';

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

const { Tmapv3 } = window;

function RouteComponent() {
  const router = useRouter();
  const { escortId: recruitId } = Route.useParams();
  const { data } = getEscortDetail(Number(recruitId));
  const mapRef = useRef<HTMLDivElement>(null);
  const {
    mapInstance,
    isMapReady,
    addPolyline,
    fitBoundsToCoordinates,
    addMarker,
    addCustomMarker,
    resetPolyline,
  } = useMap(mapRef as React.RefObject<HTMLDivElement>);

  const { route, patient, helper, estimatedMeetingTime, escortId } = data.data;
  const { helperLocations, patientLocations, escortStatuses } = useSocket(
    String(escortId),
    'customer'
  );
  const currentStatus = escortStatuses?.escortStatus ?? '만남중';

  const patientMarker = useRef<TMapMarker>(null);
  const helperMarker = useRef<TMapMarker>(null);
  const meetingMarker = useRef<TMapMarker>(null);
  const hospitalMarker = useRef<TMapMarker>(null);
  const returnMarker = useRef<TMapMarker>(null);

  const { meetingToHospital, hospitalToReturn } = route;
  const { meetingLocationInfo, hospitalLocationInfo, returnLocationInfo } = route.routeSimple;
  const { name: patientName, imageUrl: patientImageUrl } = patient;
  const { name: helperName, imageUrl: helperImageUrl, contact: helperContact } = helper;

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

  // 상태 변경 시 폴리라인 다시 그리기 (지도 로드 완료 후)
  useEffect(() => {
    if (!isMapReady) return; // 지도가 준비되지 않았으면 리턴

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
        fitBoundsToCoordinates([
          { lat: helperLocations?.latitude, lon: helperLocations?.longitude },
          { lat: patientLocations?.latitude, lon: patientLocations?.longitude },
        ]);
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
        fitBoundsToCoordinates([
          {
            lat: meetingLocationInfo?.lat,
            lon: meetingLocationInfo?.lon,
          },
          {
            lat: hospitalLocationInfo?.lat,
            lon: hospitalLocationInfo?.lon,
          },
        ]);
        break;
      case '진료중':
        handleSetMarkerVisible({
          patient: false,
          helper: true,
          isMeeting: false,
          isHospital: true,
          isReturn: false,
        });
        fitBoundsToCoordinates([
          {
            lat: hospitalLocationInfo?.lat,
            lon: hospitalLocationInfo?.lon,
          },
        ]);
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
        fitBoundsToCoordinates([
          {
            lat: hospitalLocationInfo?.lat,
            lon: hospitalLocationInfo?.lon,
          },
          {
            lat: returnLocationInfo?.lat,
            lon: returnLocationInfo?.lon,
          },
        ]);
        break;
      default:
        break;
    }
  }, [currentStatus, isMapReady]); // isMapReady 의존성 추가

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
        patientMarker.current = addCustomMarker(
          patientLocations.latitude,
          patientLocations.longitude,
          `${patientName} 고객`,
          patientImageUrl
        );
      } else {
        patientMarker.current?.setPosition(
          new Tmapv3.LatLng(patientLocations.latitude, patientLocations.longitude)
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
      } else {
        helperMarker.current?.setPosition(
          new Tmapv3.LatLng(helperLocations.latitude, helperLocations.longitude)
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
      <>
        <PageLayout.Header showClose={true} onClose={() => router.navigate({ to: '/customer' })} />
        <PageLayout.Content>
          <WritingReport />
        </PageLayout.Content>
        <PageLayout.Footer>
          <Footer
            escortStatus={currentStatus as EscortStatusProps}
            handleClickGoToReport={handleClickGoToReport}
            handleClickCallHelper={() => call(helperContact)}
            handleClickGoToCustomerCenter={() => call(import.meta.env.VITE_CUSTOMER_PHONE_NUMBER)}
          />
        </PageLayout.Footer>
      </>
    );
  }

  if (currentStatus === '동행완료') {
    return (
      <>
        <PageLayout.Header showClose={true} onClose={() => router.history.back()} />
        <PageLayout.Content>
          <EscortCompleted />
        </PageLayout.Content>
        <PageLayout.Footer>
          <Footer
            escortStatus={currentStatus as EscortStatusProps}
            handleClickGoToReport={handleClickGoToReport}
            handleClickCallHelper={() => call(helperContact)}
            handleClickGoToCustomerCenter={() => call(import.meta.env.VITE_CUSTOMER_PHONE_NUMBER)}
          />
        </PageLayout.Footer>
      </>
    );
  }
  return (
    <>
      <Header updateBefore={updatedBefore(helperLocations?.timestamp)} showBack={true} />
      <PageLayout.Content>
        <div className='flex h-full flex-col'>
          {/* 지도 */}
          <div className='bg-background-default-white2 flex-center relative h-[27rem] w-full'>
            <div ref={mapRef}></div>
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
          handleClickCallHelper={() => call(helperContact)}
          handleClickGoToCustomerCenter={() => call(import.meta.env.VITE_CUSTOMER_PHONE_NUMBER)}
        />
      </PageLayout.Footer>
    </>
  );
}
