import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Header, Footer, DashBoardCard } from '@dashboard/components';
import { getEscortDetail, postCurrentPosition } from '@dashboard/apis';
import { FloatingButton, TermsBottomSheet } from '@components';
import { useEffect, useRef, useState } from 'react';
import { useMap } from '@hooks';
import type { Position, TMapMarker } from '@types';
import { useSSE } from '@dashboard/hooks';
import { updatedBefore } from '@helper/utils';
export const Route = createFileRoute('/dashboard/map/$encryptedId')({
  component: RouteComponent,
});

const { Tmapv3 } = window;

function RouteComponent() {
  // 암호화된 아이디를 복호화하여 동행 아이디로 변환
  const { encryptedId: recruitId } = Route.useParams();
  const { data: escortData } = getEscortDetail(Number(recruitId));
  //필요한 데이터 추가로 escortData.data에서 가져오기
  const { estimatedMeetingTime, helper, route, escortId } = escortData?.data ?? {};
  const { mutate: postCurrentPositionCall } = postCurrentPosition();
  const timerRef = useRef<number | null>(null);
  const [curLocation, setCurLocation] = useState<Position | null>(null);
  const { helperLocations } = useSSE(String(escortId), 'patient');

  const mapRef = useRef<HTMLDivElement>(null);
  const { mapInstance, setCurrentLocation, fitBoundsToCoordinates, addMarker, addCustomMarker } =
    useMap(mapRef as React.RefObject<HTMLDivElement>);

  const patientMarker = useRef<TMapMarker>(null);
  const helperMarker = useRef<TMapMarker>(null);
  const meetingMarker = useRef<TMapMarker>(null);

  const { meetingLocationInfo } = route.routeSimple;
  const { name: helperName, imageUrl: helperImageUrl, contact: helperContact } = helper;

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      timerRef.current = window.setInterval(() => {
        setCurLocation({
          lat: latitude,
          lon: longitude,
        });
        postCurrentPositionCall({
          params: { path: { escortId: Number(escortId) }, query: { role: 'patient' } },
          body: {
            latitude: latitude,
            longitude: longitude,
          },
        });
      }, 1000);
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [escortId]);

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

  const handleClickCallHelper = () => {
    window.open(`tel:${helperContact}`, '_blank');
  };
  const handleClickGoToCustomerCenter = () => {
    window.open(`tel:010-2514-9058`, '_blank');
  };

  return (
    <PageLayout>
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
          handleClickCallHelper={handleClickCallHelper}
          handleClickGoToCustomerCenter={handleClickGoToCustomerCenter}
        />
      </PageLayout.Footer>
      <TermsBottomSheet
        defaultOpen={!localStorage.getItem('termsAgreement')}
        closeOnBackdrop={false}
        onSubmit={() => {
          localStorage.setItem('termsAgreement', 'true');
        }}
      />
    </PageLayout>
  );
}
