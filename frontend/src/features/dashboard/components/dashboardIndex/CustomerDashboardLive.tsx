import { DashBoardCard } from '@dashboard/components';
import type { RouteSimpleResponse } from '@customer/types';
import type { StatusTitleProps } from '@dashboard/types';

type Props = {
  escortStatus: StatusTitleProps;
  title: string;
  route: RouteSimpleResponse;
};

const CustomerDashboardLive = ({ escortStatus, title, route }: Props) => {
  const address = (() => {
    if (escortStatus === '만남중') return route.meetingLocationInfo;
    if (escortStatus === '병원행' || escortStatus === '진료중') return route.hospitalLocationInfo;
    if (escortStatus === '복귀중') return route.returnLocationInfo;
    return undefined;
  })();

  return (
    <DashBoardCard>
      <DashBoardCard.TitleWrapper>
        <DashBoardCard.StatusTitle escortStatus={escortStatus} />
        <DashBoardCard.Title text={title} />
      </DashBoardCard.TitleWrapper>
      <DashBoardCard.Divider />
      <DashBoardCard.ContentWrapper>
        <DashBoardCard.ContentTitle>
          <DashBoardCard.AddressContent
            detailAddress={address?.detailAddress ?? ''}
            address={address?.address ?? ''}
            placeName={address?.placeName ?? ''}
          />
        </DashBoardCard.ContentTitle>
      </DashBoardCard.ContentWrapper>
    </DashBoardCard>
  );
};

export default CustomerDashboardLive;
