import { IcHeadphoneQuestionmark } from '@icons';
import { getRouteApi, useRouter } from '@tanstack/react-router';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { SlideButton } from '@entities/escort/ui';

import { useMap } from '@shared/hooks';
import type { Position, TMapMarker } from '@shared/types';
import { Button, FloatingButton } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';

import { getEscortDetail, patchEscortMemo, patchEscortStatusByEscortId } from '@dashboard/apis';
import {
  DashBoardCard,
  Header,
  HelperDashboardSearchCard,
  HelperDashboardSummary,
  HelperDashboardTaxiCard,
} from '@dashboard/components';
import { useWebSocket } from '@dashboard/hooks';
import type { EscortStatus, StatusTitleProps } from '@dashboard/types';

import { updatedBefore } from '@helper/utils';

const ESCORT_STATUS_ORDER: EscortStatus[] = [
  '동행준비',
  '만남중',
  '병원행',
  '진료중',
  '복귀중',
  '리포트작성중',
  '동행완료',
];

type DashboardCardProps = {
  escortStatus: StatusTitleProps;
  title: string;
  address?: {
    locationInfoId: number;
    placeName: string;
    address: string;
    detailAddress: string;
    lat: number;
    lon: number;
  };
  card: ReactNode;
  button: ReactNode;
};

const { Tmapv3 } = window;

const Route = getRouteApi('/dashboard/$escortId/helper/');

const HelperDashboardPage = () => {
  const router = useRouter();
  const { escortId: recruitId } = Route.useParams();
  const { data: escortDetailOrigin } = getEscortDetail(Number(recruitId));
  const { mutate: patchEscortMemoCall } = patchEscortMemo();
  const { mutate: patchEscortStatusByEscortIdCall } = patchEscortStatusByEscortId();
  // const { mutate: postCurrentPositionCall } = postCurrentPosition();
  const timerRef = useRef<number | null>(null);
  const [memo, setMemo] = useState('');
  const { escortId, route, patient, customerContact, estimatedMeetingTime, purpose, extraRequest } =
    escortDetailOrigin.data;
  const [escortStatus, setEscortStatus] = useState(escortDetailOrigin.data.escortStatus);
  const [curLocation, setCurLocation] = useState<Position | null>(null);
  const { patientLocations, sendLocation } = useWebSocket(String(escortId), 'helper');

  const {
    meetingToHospital,
    hospitalToReturn,
    routeSimple: { meetingLocationInfo, hospitalLocationInfo, returnLocationInfo },
  } = route;

  const mapRef = useRef<HTMLDivElement>(null);
  const {
    mapInstance,
    isMapReady,
    addPolyline,
    setCurrentLocation,
    fitBoundsToCoordinates,
    addMarker,
    resetPolyline,
  } = useMap(mapRef as React.RefObject<HTMLDivElement>);

  const patientMarker = useRef<TMapMarker>(null);
  const helperMarker = useRef<TMapMarker>(null);
  const meetingMarker = useRef<TMapMarker>(null);
  const hospitalMarker = useRef<TMapMarker>(null);
  const returnMarker = useRef<TMapMarker>(null);

  const handleSetMarkerVisible = ({
    patient,
    isMeeting,
    isHospital,
    isReturn,
  }: {
    patient: boolean;
    isMeeting: boolean;
    isHospital: boolean;
    isReturn: boolean;
  }) => {
    patientMarker.current?.setVisible(patient);
    meetingMarker.current?.setVisible(isMeeting);
    hospitalMarker.current?.setVisible(isHospital);
    returnMarker.current?.setVisible(isReturn);
  };

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude, accuracy } = position.coords;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      timerRef.current = window.setInterval(() => {
        setCurLocation({
          lat: latitude,
          lon: longitude,
        });
        sendLocation(latitude, longitude, accuracy);
      }, 1000);
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [escortId]);

  const patientContact = patient.contact;

  const handleClickCallPatient = () => {
    window.open(`tel:${patientContact}`);
  };
  const handleClickCallCustomer = () => {
    window.open(`tel:${customerContact}`);
  };
  const handleClickCustomerCenter = () => {
    window.open(`tel:010-2514-9058`);
  };

  const handleClickNextStep = () => {
    patchEscortStatusByEscortIdCall(
      {
        params: {
          path: { escortId: escortId },
        },
      },
      {
        onSuccess: () => {
          const currentIndex = ESCORT_STATUS_ORDER.findIndex((s) => s === escortStatus);
          const nextIndex = Math.min(currentIndex + 1, ESCORT_STATUS_ORDER.length - 1);
          const nextStatus = ESCORT_STATUS_ORDER[nextIndex];
          setEscortStatus(nextStatus);
        },
        onError: (error) => {
          console.error('Failed to update escort status:', error);
        },
      }
    );
    if (escortStatus === '진료중') {
      patchEscortMemoCall({
        params: { path: { escortId: escortId } },
        body: { memo: memo },
      });
    }
  };

  useEffect(() => {
    if (escortStatus === '리포트작성중') {
      router.navigate({
        to: '/helper/escort/$escortId/report/$step',
        params: { escortId: String(recruitId), step: 'time' },
      });
      return;
    }
    if (escortStatus === '동행완료') {
      router.navigate({
        to: '/helper/escort/$escortId',
        params: { escortId: String(recruitId) },
      });
    }
  }, [escortStatus, recruitId, router]);

  // 상태 변경 시 폴리라인 다시 그리기 (지도 로드 완료 후)
  useEffect(() => {
    if (!isMapReady) return; // 지도가 준비되지 않았으면 리턴

    resetPolyline();
    switch (escortStatus) {
      case '만남중':
        handleSetMarkerVisible({
          patient: true,
          isMeeting: true,
          isHospital: false,
          isReturn: false,
        });
        fitBoundsToCoordinates([
          { lat: meetingLocationInfo?.lat, lon: meetingLocationInfo?.lon },
          { lat: patientLocations?.latitude, lon: patientLocations?.longitude },
        ]);
        break;
      case '병원행':
        handleSetMarkerVisible({
          patient: false,
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
  }, [escortStatus, isMapReady]);

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

  useEffect(() => {
    if (!mapInstance || !curLocation) return;

    // 환자 마커 생성 또는 업데이트
    if (curLocation?.lat && curLocation?.lon) {
      if (!helperMarker.current) {
        helperMarker.current = addMarker(curLocation.lat, curLocation.lon, 'me');
      } else {
        helperMarker.current?.setPosition(new Tmapv3.LatLng(curLocation.lat, curLocation.lon));
      }
    }
  }, [mapInstance, curLocation?.lat, curLocation?.lon]);

  const dashboardCardProps = (): DashboardCardProps => {
    if (escortStatus === '만남중') {
      return {
        escortStatus: escortStatus,
        title: '만남장소로 이동하세요',
        address: route.routeSimple.meetingLocationInfo,
        card: <HelperDashboardSearchCard />,
        button: (
          <SlideButton
            onConfirm={handleClickNextStep}
            initialLabel='밀어서 만남 완료'
            confirmedLabel='병원 가기 시작...'
          />
        ),
      };
    }
    if (escortStatus === '병원행') {
      return {
        escortStatus: escortStatus,
        title: '병원으로 이동하세요',
        address: route.routeSimple.hospitalLocationInfo,
        card: (
          <HelperDashboardTaxiCard
            estimatedTaxiTime={route.meetingToHospitalEstimatedTime}
            estimatedTaxiFee={route.meetingToHospitalEstimatedTaxiFee}
          />
        ),
        button: (
          <SlideButton
            onConfirm={handleClickNextStep}
            initialLabel='밀어서 병원 도착'
            confirmedLabel='진료 보기 시작...'
          />
        ),
      };
    }
    if (escortStatus === '진료중') {
      return {
        escortStatus: escortStatus,
        title: '병원에서 진료를 보세요',
        address: route.routeSimple.hospitalLocationInfo,
        card: (
          <HelperDashboardSummary
            purpose={purpose ?? ''}
            extraRequest={extraRequest ?? ''}
            setMemo={setMemo}
          />
        ),
        button: (
          <SlideButton
            onConfirm={handleClickNextStep}
            initialLabel='밀어서 진료 완료'
            confirmedLabel='복귀 시작...'
          />
        ),
      };
    }
    if (escortStatus === '복귀중') {
      return {
        escortStatus: escortStatus,
        title: '복귀 장소로 이동하세요',
        address: route.routeSimple.returnLocationInfo,
        card: (
          <HelperDashboardTaxiCard
            estimatedTaxiTime={route.hospitalToReturnEstimatedTime}
            estimatedTaxiFee={route.hospitalToReturnEstimatedTaxiFee}
          />
        ),
        button: (
          <SlideButton
            onConfirm={handleClickNextStep}
            initialLabel='밀어서 복귀 완료'
            confirmedLabel='리포트 작성 시작...'
          />
        ),
      };
    } else {
      return {
        //쓰지 않음. 타입 안정성 위한 코드
        escortStatus: '복귀중' as StatusTitleProps,
        title: '',
        card: <></>,
        button: <></>,
      };
    }
  };

  return (
    <>
      <Header
        updateBefore={updatedBefore(patientLocations?.timestamp)}
        showUpdateBefore={escortStatus === '만남중'}
      />
      <PageLayout.Content className='overflow-y-auto'>
        <div className='bg-background-default-white2 flex-center relative h-[27rem] w-full'>
          <div ref={mapRef}></div>
          <FloatingButton
            icon='current'
            position='bottom-left'
            onClick={() => setCurrentLocation()}
          />
        </div>
        <DashBoardCard>
          <DashBoardCard.TitleWrapper>
            <DashBoardCard.StatusTitle escortStatus={dashboardCardProps().escortStatus} />
            <DashBoardCard.Title text={dashboardCardProps().title} />
            <DashBoardCard.ButtonWrapper>
              <div className='flex-1'>
                <Button variant='assistive' size='sm' onClick={handleClickCallPatient}>
                  환자에게 전화하기
                </Button>
              </div>
              <div className='flex-1'>
                <Button variant='assistive' size='sm' onClick={handleClickCallCustomer}>
                  고객에게 전화하기
                </Button>
              </div>
              <div className='w-[3.3rem]'>
                <Button variant='assistive' size='sm' onClick={handleClickCustomerCenter}>
                  <IcHeadphoneQuestionmark className='[&_path]:fill-icon-neutral-primary h-[2.4rem] w-[2.4rem]' />
                </Button>
              </div>
            </DashBoardCard.ButtonWrapper>
          </DashBoardCard.TitleWrapper>
          <DashBoardCard.Divider />
          <DashBoardCard.ContentWrapper>
            {escortStatus === '만남중' && <DashBoardCard.TimeContent time={estimatedMeetingTime} />}

            <DashBoardCard.AddressContent
              detailAddress={dashboardCardProps().address?.detailAddress ?? ''}
              address={dashboardCardProps().address?.address ?? ''}
              placeName={dashboardCardProps().address?.placeName ?? ''}
              position={{
                lat: dashboardCardProps().address?.lat ?? 0,
                lng: dashboardCardProps().address?.lon ?? 0,
              }}
            />
            {dashboardCardProps().card}
          </DashBoardCard.ContentWrapper>
        </DashBoardCard>
      </PageLayout.Content>
      <PageLayout.Footer>{dashboardCardProps().button}</PageLayout.Footer>
    </>
  );
};

export default HelperDashboardPage;
