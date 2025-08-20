import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Header, Footer, DashBoardCard } from '@dashboard/components';
import { getEscortDetail } from '@dashboard/apis';
import { TermsBottomSheet } from '@components';
import { call } from '@utils';
export const Route = createFileRoute('/dashboard/$escortId/map')({
  component: RouteComponent,
});

function RouteComponent() {
  const { escortId: recruitId } = Route.useParams();
  const { data: escortData } = getEscortDetail(Number(recruitId));
  //필요한 데이터 추가로 escortData.data에서 가져오기
  const { estimatedMeetingTime, helper, route } = escortData?.data ?? {};

  return (
    <PageLayout>
      <Header showBack={false} updateBefore={10} />
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
        onSubmit={() => {
          localStorage.setItem('termsAgreement', 'true');
        }}
      />
    </PageLayout>
  );
}
