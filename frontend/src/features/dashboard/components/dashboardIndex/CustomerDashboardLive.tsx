import type { RouteSimpleResponse } from '@customer/types';

import { DashBoardCard } from '@dashboard/components';
import type { StatusTitleProps } from '@dashboard/types';

type Props = {
  escortStatus: StatusTitleProps;
  time?: string;
  route: RouteSimpleResponse;
};

const CustomerDashboardLive = ({ escortStatus, time, route }: Props) => {
  const { meetingLocationInfo, hospitalLocationInfo, returnLocationInfo } = route;

  const placeInfo = (() => {
    switch (escortStatus) {
      case '만남중':
        return meetingLocationInfo;
      case '병원행':
      case '진료중':
        return hospitalLocationInfo;
      case '복귀중':
        return returnLocationInfo;
      default:
        return undefined;
    }
  })();

  const title = (() => {
    switch (escortStatus) {
      case '만남중':
        return '만남장소로 이동 중';
      case '병원행':
        return '병원으로 이동 중';
      case '진료중':
        return '진료중';
      case '복귀중':
        return '복귀 장소로 이동 중';
      default:
        return '';
    }
  })();

  return (
    <DashBoardCard>
      <DashBoardCard.TitleWrapper>
        <DashBoardCard.StatusTitle escortStatus={escortStatus} />
        <DashBoardCard.Title text={title} />
      </DashBoardCard.TitleWrapper>
      <DashBoardCard.Divider />
      <DashBoardCard.ContentWrapper>
        {escortStatus === '만남중' && time && <DashBoardCard.TimeContent time={time} />}
        <DashBoardCard.AddressContent
          detailAddress={placeInfo?.detailAddress ?? ''}
          address={placeInfo?.address ?? ''}
          placeName={placeInfo?.placeName ?? ''}
          position={{ lat: placeInfo?.lat ?? 0, lng: placeInfo?.lon ?? 0 }}
        />
      </DashBoardCard.ContentWrapper>
    </DashBoardCard>
  );
};

export default CustomerDashboardLive;
