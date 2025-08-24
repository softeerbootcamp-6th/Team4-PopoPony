import { getRouteApi } from '@tanstack/react-router';

import { useEffect, useRef, useState } from 'react';

import { useMap } from '@shared/hooks';
import { call } from '@shared/lib';
import type { Position, TMapMarker } from '@shared/types';
import { FloatingButton, TermsBottomSheet } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';

import { getEscortDetail } from '@dashboard/apis';
import { DashBoardCard, Footer, Header } from '@dashboard/components';
import { useSocket } from '@dashboard/hooks';

import { updatedBefore } from '@helper/utils';

const { Tmapv3 } = window;

const decryptId = (encryptedId: string) => {
  const encoded = parseInt(encryptedId, 16);
  const decryptedId = (encoded - 13579) / 73;
  return decryptedId;
};

const Route = getRouteApi('/dashboard/map/$encryptedId');

const PatientDashboardPage = () => {
  const { encryptedId } = Route.useParams();
  const decryptedId = decryptId(encryptedId);
  const { data: escortData } = getEscortDetail(Number(decryptedId));

  const { estimatedMeetingTime, helper, route, escortId } = escortData?.data ?? {};

  const timerRef = useRef<number | null>(null);
  const [curLocation, setCurLocation] = useState<Position | null>(null);
  const { helperLocations, sendLocation } = useSocket(String(escortId), 'patient');

  const mapRef = useRef<HTMLDivElement>(null);
  const { mapInstance, setCurrentLocation, fitBoundsToCoordinates, addMarker, addCustomMarker } =
    useMap(mapRef as React.RefObject<HTMLDivElement>);

  const patientMarker = useRef<TMapMarker>(null);
  const helperMarker = useRef<TMapMarker>(null);
  const meetingMarker = useRef<TMapMarker>(null);

  const { meetingLocationInfo } = route.routeSimple;
  const { name: helperName, imageUrl: helperImageUrl } = helper;

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
  }, [escortId, sendLocation]);

  useEffect(() => {
    if (!mapInstance || !curLocation) return;

    // 환자 마커 생성 또는 업데이트
    if (curLocation?.lat && curLocation?.lon) {
      if (!patientMarker.current) {
        patientMarker.current = addMarker(curLocation.lat, curLocation.lon, 'me');
        fitBoundsToCoordinates([
          { lat: curLocation.lat, lon: curLocation.lon },
          { lat: helperLocations?.latitude, lon: helperLocations?.longitude },
        ]);
      } else {
        patientMarker.current?.setPosition(new Tmapv3.LatLng(curLocation.lat, curLocation.lon));
      }
    }
  }, [mapInstance, curLocation?.lat, curLocation?.lon]);

  useEffect(() => {
    if (!mapInstance || !helperName || !helperImageUrl) return;

    if (helperLocations?.latitude && helperLocations?.longitude) {
      if (!helperMarker.current) {
        helperMarker.current = addCustomMarker(
          helperLocations.latitude,
          helperLocations.longitude,
          `${helperName} 도우미`,
          helperImageUrl
        );
        fitBoundsToCoordinates([
          { lat: helperLocations?.latitude, lon: helperLocations?.longitude },
          { lat: curLocation?.lat, lon: curLocation?.lon },
        ]);
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

  useEffect(() => {
    if (!mapInstance) return;

    meetingMarker.current = addMarker(
      meetingLocationInfo.lat,
      meetingLocationInfo.lon,
      'home',
      meetingLocationInfo.placeName
    );
  }, [mapInstance]);

  return (
    <>
      <Header showBack={false} updateBefore={updatedBefore(helperLocations?.timestamp)} />
      <PageLayout.Content>
        <div className='flex h-full flex-col'>
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
              <DashBoardCard.Title
                text={`${route.routeSimple.meetingLocationInfo.detailAddress}에서 도우미와 만나세요`}
              />
            </DashBoardCard.TitleWrapper>
            <DashBoardCard.Divider />
            <DashBoardCard.ContentWrapper>
              <DashBoardCard.ContentTitle>
                <DashBoardCard.TimeContent time={estimatedMeetingTime} />
                <DashBoardCard.AddressContent
                  detailAddress={route.routeSimple.meetingLocationInfo.detailAddress}
                  address={route.routeSimple.meetingLocationInfo.address}
                  placeName={route.routeSimple.meetingLocationInfo.placeName}
                  position={{
                    lat: route.routeSimple.meetingLocationInfo.lat,
                    lng: route.routeSimple.meetingLocationInfo.lon,
                  }}
                />
              </DashBoardCard.ContentTitle>
            </DashBoardCard.ContentWrapper>
          </DashBoardCard>
        </div>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Footer
          escortStatus={escortData?.data.escortStatus}
          handleClickCallHelper={() => call(helper.contact)}
          handleClickGoToCustomerCenter={() => call(import.meta.env.VITE_CUSTOMER_PHONE_NUMBER)}
        />
      </PageLayout.Footer>
      <TermsBottomSheet
        defaultOpen={!localStorage.getItem('termsAgreement')}
        closeOnBackdrop={false}
        onSubmit={() => {
          localStorage.setItem('termsAgreement', 'true');
        }}
      />
    </>
  );
};

export default PatientDashboardPage;
