import { Tabs, Divider, SuspenseUI } from '@components';
import { HelperCard, InfoSection, ReportInfoCard, WarningBox } from '@customer/components';
import { IcAlertCircle } from '@icons';
import {
  getApplicationListById,
  getRecruitReportByRecruitId,
  getRecruitReviewByRecruitId,
} from '@customer/apis';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { dateFormat, timeFormat } from '@utils';

type ReportTabProps = {
  setHasReview: (hasReview: boolean) => void;
  setHelperId: (helperId: number) => void;
};

const routeApi = getRouteApi('/customer/escort/$escortId/');

const statusMap = {
  좋았어요: 'good',
  괜찮아요: 'average',
  아쉬워요: 'bad',
} as const;

const ReportTab = ({ setHasReview, setHelperId }: ReportTabProps) => {
  const navigate = useNavigate();
  const { escortId } = routeApi.useParams();
  const { data: applicationList } = getApplicationListById(Number(escortId));
  const {
    data: reportDataOriginal,
    isLoading: isReportLoading,
    error: reportError,
  } = getRecruitReportByRecruitId(Number(escortId));
  const { data: reportData } = reportDataOriginal || {};
  const {
    data: reviewData,
    error: reviewError,
    isLoading: isReviewLoading,
  } = getRecruitReviewByRecruitId(Number(escortId), true);

  const hasReview = Boolean(reviewData?.data && reviewData.data.reviewId !== 0);
  const hasReport = Boolean(reportData && reportData.reportId !== 0);
  useEffect(() => {
    if (hasReview) setHasReview(true);
  }, [hasReview, setHasReview]);

  const actualStartTime = reportData?.actualMeetingTime;
  const actualEndTime = reportData?.actualReturnTime;

  const handleHelperCardClick = (helperId: number, escortId: string, applicationId: number) => {
    navigate({
      to: '/customer/escort/$escortId/$helperId/helper/$applicationId',
      params: {
        escortId: escortId,
        helperId: helperId.toString(),
        applicationId: applicationId.toString(),
      },
      search: {
        canSelect: 'false',
      },
    });
  };
  useEffect(() => {
    if (applicationList?.data?.applicationList?.[0]?.helper?.helperProfileId) {
      setHelperId(applicationList.data.applicationList[0].helper.helperProfileId!);
    }
  }, [applicationList, setHelperId]);

  const reviewSection = (() => {
    if (isReviewLoading) {
      return (
        <div className='h-[15rem]'>
          <SuspenseUI />
        </div>
      );
    }
    if (!reviewError && hasReview) {
      return (
        <div>
          <div className='border-stroke-neutral-dark flex flex-col gap-[1.2rem] rounded-[0.8rem] border px-[1.6rem] py-[1.2rem]'>
            <div className='flex-start gap-[1.2rem]'>
              <img
                src={`/images/status-${statusMap[reviewData?.data?.satisfactionLevel as keyof typeof statusMap]}.svg`}
                alt={`status-${statusMap[reviewData?.data?.satisfactionLevel as keyof typeof statusMap]}`}
                className='h-[4rem] w-[4rem]'
              />
              <div className='flex flex-col gap-[0.2rem]'>
                <h6 className='body2-14-bold text-text-neutral-primary'>
                  {reviewData?.data?.satisfactionLevel}
                </h6>
                <p className='body2-14-medium text-text-neutral-primary'>
                  {reviewData?.data?.shortComment}
                </p>
              </div>
            </div>
            <div className='bg-stroke-neutral-light h-[0.1rem] w-full rounded-full'></div>
            <div className='flex-start min-h-[2.8rem] gap-[2.8rem]'>
              <span className='label2-14-bold text-text-neutral-secondary'>좋은 점</span>
              <div className='flex-start flex-wrap gap-[0.4rem]'>
                {reviewData?.data?.positiveFeedbackList?.length
                  ? reviewData.data.positiveFeedbackList.map((item, index) => (
                      <div
                        className='flex-center label2-14-medium bg-neutral-10 text-text-neutral-secondary h-[2.8rem] rounded-[0.4rem] px-[0.8rem]'
                        key={index}>
                        {item}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  })();

  return (
    <>
      <Tabs.TabsContentSection>
        {applicationList?.data?.applicationList[0] &&
          applicationList?.data?.applicationList[0]?.helper && (
            <HelperCard
              helper={applicationList?.data?.applicationList[0]?.helper}
              onClick={() =>
                handleHelperCardClick(
                  applicationList!.data!.applicationList[0]!.helper!.helperProfileId!,
                  escortId,
                  applicationList!.data!.applicationList[0]!.applicationId!
                )
              }
            />
          )}
      </Tabs.TabsContentSection>
      <Tabs.TabsDivider />
      <Tabs.TabsContentSection>
        {reviewSection}
        {isReportLoading && <SuspenseUI />}
        {!isReportLoading && (reportError || !hasReport) && <ReportInfoCard />}
        {!isReportLoading && !reportError && hasReport && (
          <>
            <h3 className='subtitle-18-bold text-text-neutral-primary mt-[2rem]'>동행 리포트</h3>
            <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
              <InfoSection title='진행 시간'>
                {actualStartTime && actualEndTime ? (
                  <span className='body1-16-bold text-text-neutral-primary'>
                    {timeFormat(actualStartTime, 'aaa HH:mm')} ~
                    {timeFormat(actualEndTime, 'aaa HH:mm')}
                  </span>
                ) : (
                  <span className='body1-16-medium text-text-neutral-secondary'>-</span>
                )}
                {reportData?.extraMinutes && reportData?.extraMinutes > 0 && (
                  <div className='flex-start gap-[0.4rem]'>
                    <IcAlertCircle
                      className='[&_path]:fill-icon-red-primary'
                      width={16}
                      height={16}
                    />
                    <span className='label3-12-medium text-text-red-primary'>
                      예상 동행 시간보다 {reportData?.extraMinutes}분 초과되었어요!
                    </span>
                  </div>
                )}
              </InfoSection>
              {reportData?.hasNextAppointment && (
                <InfoSection title='다음 예약'>
                  <span className='body1-16-medium text-text-neutral-primary'>
                    {reportData?.nextAppointmentTime &&
                      dateFormat(reportData?.nextAppointmentTime, 'yyyy년 MM월 dd일 aaa HH시 mm분')}
                  </span>
                </InfoSection>
              )}
              <Divider />
              <InfoSection title='전달 내용'>
                <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary flex flex-col rounded-[0.6rem] p-[1rem]'>
                  <span>{reportData?.description || '-'}</span>
                </div>
              </InfoSection>
            </div>

            <div>
              <h3 className='subtitle-18-bold text-text-neutral-primary'>총 이용 금액</h3>
              <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
                <div className='flex-between'>
                  <span className='body2-14-medium text-text-neutral-secondary'>기존 결제금액</span>
                  <span className='body1-16-bold text-text-neutral-primary'>
                    {reportData?.baseFee?.toLocaleString()}원
                  </span>
                </div>
                <Divider />
                <div className='flex flex-col gap-[0.8rem]'>
                  <div className='flex-between'>
                    <span className='body2-14-medium text-text-neutral-secondary'>
                      추가 결제금액
                    </span>
                    <span className='body1-16-bold text-text-neutral-primary'>
                      {(
                        (reportData?.taxiFee || 0) + (reportData?.extraTimeFee || 0)
                      ).toLocaleString()}
                      원
                    </span>
                  </div>
                  <div className='flex-between'>
                    <span className='body2-14-medium text-text-neutral-assistive'>택시 요금</span>
                    <span className='label3-12-medium text-text-neutral-secondary'>
                      {reportData?.taxiFee?.toLocaleString()}원
                    </span>
                  </div>
                  <div className='flex-between'>
                    <span className='body2-14-medium text-text-neutral-assistive'>
                      이용 시간 초과 요금
                    </span>
                    <span className='label3-12-medium text-text-neutral-secondary'>
                      {reportData?.extraTimeFee?.toLocaleString()}원
                    </span>
                  </div>
                  <WarningBox text='이용시간 초과요금은 15분에 5천원이에요.' />
                </div>
              </div>
            </div>
          </>
        )}
      </Tabs.TabsContentSection>
    </>
  );
};

export default ReportTab;
