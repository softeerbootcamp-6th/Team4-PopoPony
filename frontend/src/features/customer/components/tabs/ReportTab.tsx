import { Tabs, Divider, Spinner } from '@components';
import { HelperCard, InfoSection, ReportInfoCard, WarningBox } from '@customer/components';
import { IcAlertCircle } from '@icons';
import {
  getApplicationListById,
  getRecruitReportByRecruitId,
  getRecruitReviewByRecruitId,
} from '@customer/apis';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
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
  const { data: applicationList, isLoading: isApplicationListLoading } = getApplicationListById(
    Number(escortId)
  );
  const { data: reportDataOriginal } = getRecruitReportByRecruitId(Number(escortId));
  const { data: reportData } = reportDataOriginal || {};
  const { data: reviewData } = getRecruitReviewByRecruitId(Number(escortId), true);
  const isReportSuccess = reportDataOriginal?.code === 10000 && reportDataOriginal?.status === 200;
  if (reviewData && reviewData.code === 10000 && reviewData.status === 200) {
    setHasReview(true);
  }

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
  if (isApplicationListLoading) return <Spinner />;

  if (applicationList && applicationList.data) {
    setHelperId(applicationList.data.applicationList[0].helper.helperProfileId!);
  }

  // //reviewData.code가 150101이면 동행완료인데 리포트가 없는거. 130101이면 동행도 없음.
  // if (reportDataOriginal && reportDataOriginal.status !== 200) {
  //   alert('잘못된 접근입니다!');
  //   return null;
  // }

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
      <Tabs.TabsContentSection>
        {reviewData && reviewData.code === 150101 && <ReportInfoCard />}

        {reviewData && reviewData.code === 10000 && reviewData.status === 200 && (
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
                  {reviewData.data?.positiveFeedbackList &&
                    reviewData.data?.positiveFeedbackList?.length > 0 &&
                    reviewData.data?.positiveFeedbackList?.map((item, index) => (
                      <div
                        className='flex-center label2-14-medium bg-neutral-10 text-text-neutral-secondary h-[2.8rem] rounded-[0.4rem] px-[0.8rem]'
                        key={index}>
                        {item}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {isReportSuccess && (
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
                <div className='flex-start gap-[0.4rem]'>
                  <IcAlertCircle
                    className='[&_path]:fill-icon-red-primary'
                    width={16}
                    height={16}
                  />
                  {reportData?.extraMinutes && reportData?.extraMinutes > 0 && (
                    <span className='label3-12-medium text-text-red-primary'>
                      예상 동행 시간보다 {reportData?.extraMinutes}분 초과되었어요!
                    </span>
                  )}
                </div>
              </InfoSection>
              <Divider />
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
      <Tabs.TabsDivider />
    </>
  );
};

export default ReportTab;
