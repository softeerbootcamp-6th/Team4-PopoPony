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

type DashboardCardProps = {
  escortStatus: StatusTitleProps;
  title: string;
  address?: {
    locationInfoId: number;
    placeName: string;
    address: string;
    detailAddress: string;
  };
};

function RouteComponent() {
  const router = useRouter();
  const { escortId: recruitId } = Route.useParams();
  const { data: escortDetailOrigin } = getEscortDetail(Number(recruitId));
  const { escortStatus, route, helper } = escortDetailOrigin.data;
  const helperContact = helper.contact;

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

  const dashboardCardProps = (): DashboardCardProps => {
    if (escortStatus === '만남중') {
      return {
        escortStatus: escortStatus,
        title: '만남장소로 이동 중',
        address: route.routeSimple.meetingLocationInfo,
      };
    }
    if (escortStatus === '병원행' || escortStatus === '진료중') {
      return {
        escortStatus: escortStatus,
        title: '병원으로 이동 중',
        address: route.routeSimple.hospitalLocationInfo,
      };
    }
    if (escortStatus === '복귀중') {
      return {
        escortStatus: escortStatus,
        title: '복귀 장소로 이동 중',
        address: route.routeSimple.returnLocationInfo,
      };
    } else {
      return {
        //쓰지 않음. 타입 안정성 위한 코드
        escortStatus: '복귀완료' as StatusTitleProps,
        title: '',
      };
    }
  };

  return (
    <PageLayout>
      <Header updateBefore={10} />
      <PageLayout.Content>
        <div className='flex h-full flex-col'>
          <div className='bg-background-default-mint flex-center h-[27rem] w-full'>지도지도</div>
          <CustomerDashboardLive
            escortStatus={dashboardCardProps().escortStatus}
            title={dashboardCardProps().title}
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
