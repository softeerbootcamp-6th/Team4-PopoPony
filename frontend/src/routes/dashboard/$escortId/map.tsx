import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Header, Footer, DashBoardCard } from '@dashboard/components';
import { getEscortDetail, postCurrentPosition } from '@dashboard/apis';
import { TermsBottomSheet } from '@components';
import { useEffect, useRef } from 'react';
export const Route = createFileRoute('/dashboard/$escortId/map')({
  component: RouteComponent,
});

function RouteComponent() {
  const { escortId: recruitId } = Route.useParams();
  const { data: escortData } = getEscortDetail(Number(recruitId));
  //필요한 데이터 추가로 escortData.data에서 가져오기
  const { estimatedMeetingTime, helper, route, escortId } = escortData?.data ?? {};
  const { mutate: postCurrentPositionCall } = postCurrentPosition();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      timerRef.current = window.setInterval(() => {
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

  const handleClickCallHelper = () => {
    window.open(`tel:${helper.contact}`, '_blank');
  };
  const handleClickGoToCustomerCenter = () => {
    window.open(`tel:010-2514-9058`, '_blank');
  };

  return (
    <PageLayout>
      <Header showBack={false} updateBefore={'10'} />
      <PageLayout.Content>
        <div className='flex h-full flex-col'>
          <div className='bg-background-default-mint flex-center h-[27rem] w-full'>지도지도</div>
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
        onSubmit={() => {
          localStorage.setItem('termsAgreement', 'true');
        }}
      />
    </PageLayout>
  );
}
