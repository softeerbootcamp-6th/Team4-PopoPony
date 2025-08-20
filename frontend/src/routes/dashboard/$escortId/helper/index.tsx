import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { getEscortDetail, patchEscortStatusByEscortId, patchEscortMemo } from '@dashboard/apis';
import { PageLayout } from '@layouts';
import {
  Header,
  DashBoardCard,
  HelperDashboardSearchCard,
  HelperDashboardTaxiCard,
  HelperDashboardSummary,
} from '@dashboard/components';
import { $api } from '@apis';
import type { StatusTitleProps, EscortStatus } from '@dashboard/types';
import { Button } from '@components';
import { IcHeadphoneQuestionmark } from '@icons';
import { useState, useEffect, type ReactNode } from 'react';

export const Route = createFileRoute('/dashboard/$escortId/helper/')({
  beforeLoad: async ({ context, params }) => {
    const { queryClient } = context;
    const recruitId = Number(params.escortId);

    const escortDetailOpts = $api.queryOptions('get', '/api/escorts/recruits/{recruitId}', {
      params: { path: { recruitId } },
    });

    const escortDetail = await queryClient.ensureQueryData(escortDetailOpts);

    if (escortDetail.data.escortStatus === '동행준비') {
      throw redirect({
        to: '/dashboard/$escortId/helper/prepare',
        params: { escortId: String(recruitId) },
      });
    }
    if (escortDetail.data.escortStatus === '리포트작성중') {
      throw redirect({
        to: '/helper/escort/$escortId/report/$step',
        params: {
          escortId: String(recruitId),
          step: 'time',
        },
      });
    }
    if (escortDetail.data.escortStatus === '동행완료') {
      throw redirect({
        to: '/helper/escort/$escortId',
        params: {
          escortId: String(recruitId),
        },
      });
    }
  },
  component: RouteComponent,
});

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
  };
  card: ReactNode;
  button: ReactNode;
};

function RouteComponent() {
  const router = useRouter();
  const { escortId: recruitId } = Route.useParams();
  const { data: escortDetailOrigin } = getEscortDetail(Number(recruitId));
  const { mutate: patchEscortMemoCall } = patchEscortMemo();
  const { mutate: patchEscortStatusByEscortIdCall } = patchEscortStatusByEscortId();

  const [memo, setMemo] = useState('');
  const { escortId, route, patient, customerContact, estimatedMeetingTime, purpose, extraRequest } =
    escortDetailOrigin.data;
  const [escortStatus, setEscortStatus] = useState(escortDetailOrigin.data.escortStatus);
  // 리다이렉트는 beforeLoad에서 처리됨

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

  const dashboardCardProps = (): DashboardCardProps => {
    if (escortStatus === '만남중') {
      return {
        escortStatus: escortStatus,
        title: '만남장소로 이동하세요',
        address: route.routeSimple.meetingLocationInfo,
        card: <HelperDashboardSearchCard />,
        button: (
          <Button variant='primary' onClick={handleClickNextStep}>
            밀어서 만남 완료
          </Button>
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
          <Button variant='primary' onClick={handleClickNextStep}>
            밀어서 병원 도착
          </Button>
        ),
      };
    }
    //TODO: Footer 버튼 상황에 따른 라우팅
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
          <Button variant='primary' onClick={handleClickNextStep}>
            밀어서 진료 완료
          </Button>
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
          <Button variant='primary' onClick={handleClickNextStep}>
            밀어서 복귀 완료
          </Button>
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
    <PageLayout>
      <Header updateBefore={10} />
      <PageLayout.Content>
        <div className='bg-background-default-mint flex-center h-[27rem] w-full'>지도지도</div>
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
            />
            {dashboardCardProps().card}
          </DashBoardCard.ContentWrapper>
        </DashBoardCard>
      </PageLayout.Content>
      <PageLayout.Footer>{dashboardCardProps().button}</PageLayout.Footer>
    </PageLayout>
  );
}
