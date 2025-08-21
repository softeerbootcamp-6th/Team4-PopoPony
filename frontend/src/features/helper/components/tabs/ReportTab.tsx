import { Tabs, Divider, Spinner } from '@components';
import { InfoSection, WarningBox } from '@customer/components';
import { IcAlertCircle } from '@icons';
import { getRecruitReportByRecruitId, getRecruitReviewByRecruitId } from '@helper/apis';
import { useParams } from '@tanstack/react-router';
import { dateFormat, timeFormat } from '@utils';

const statusMap = {
  좋았어요: 'good',
  괜찮아요: 'average',
  아쉬워요: 'bad',
} as const;

const ReportTab = () => {
  const { escortId } = useParams({ from: '/helper/escort/$escortId/' });
  const { data: reportData } = getRecruitReportByRecruitId(Number(escortId));
  const isValidReport = reportData?.status === 200;
  if (reportData && !isValidReport) {
    alert(reportData.message || '리포트 조회에 실패했습니다.');
    return null;
  }

  const { data: reviewData, isLoading: isReviewDataLoading } = getRecruitReviewByRecruitId(
    Number(escortId),
    Boolean(isValidReport)
  );

  const actualStartTime = reportData?.data?.actualMeetingTime;
  const actualEndTime = reportData?.data?.actualReturnTime;

  if (isReviewDataLoading) return <Spinner />;

  return (
    <>
      <Tabs.TabsContentSection>
        {reviewData && reviewData.status === 200 && (
          <>
            <div>
              {reviewData.status === 200 && (
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
                  <div className='flex-start gap-[2.8rem]'>
                    {reviewData.data?.positiveFeedbackList &&
                      reviewData.data?.positiveFeedbackList?.length > 0 &&
                      reviewData.data?.positiveFeedbackList?.map((item, index) => (
                        <>
                          <span className='label2-14-bold text-text-neutral-secondary'>
                            좋은 점
                          </span>
                          <div className='flex-start flex-wrap gap-[0.4rem]'>
                            <div
                              className='flex-center label2-14-medium bg-neutral-10 text-text-neutral-secondary h-[2.8rem] rounded-[0.4rem] px-[0.8rem]'
                              key={index}>
                              {item}
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              )}
              <h3 className='subtitle-18-bold text-text-neutral-primary mt-[2rem]'>동행 리포트</h3>
              <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
                <InfoSection title='진행 시간'>
                  {actualStartTime && actualEndTime ? (
                    <span className='body1-16-bold text-text-neutral-primary'>
                      {timeFormat(actualStartTime, 'aaa HH:mm')} ~{' '}
                      {timeFormat(actualEndTime, 'aaa HH:mm')}
                    </span>
                  ) : (
                    <span className='body1-16-medium text-text-neutral-secondary'>-</span>
                  )}
                  {reportData?.data?.extraMinutes && reportData?.data?.extraMinutes > 0 ? (
                    <div className='flex-start gap-[0.4rem]'>
                      <IcAlertCircle
                        className='[&_path]:fill-icon-red-primary'
                        width={16}
                        height={16}
                      />
                      <span className='label3-12-medium text-text-red-primary'>
                        예상 동행 시간보다 {reportData?.data?.extraMinutes}분 초과되었어요!
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </InfoSection>
                <Divider />
                {reportData?.data?.hasNextAppointment && (
                  <>
                    <InfoSection title='다음 예약'>
                      <span className='body1-16-medium text-text-neutral-primary'>
                        {reportData?.data?.nextAppointmentTime &&
                          dateFormat(
                            reportData?.data?.nextAppointmentTime,
                            'yyyy년 MM월 dd일 aaa HH시 mm분'
                          )}
                      </span>
                    </InfoSection>
                    <Divider />
                  </>
                )}

                <InfoSection title='전달 내용'>
                  <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary flex flex-col rounded-[0.6rem] p-[1rem]'>
                    <span>{reportData?.data?.description}</span>
                  </div>
                </InfoSection>
              </div>
            </div>

            {/* 이용 금액 */}
            <div>
              <h3 className='subtitle-18-bold text-text-neutral-primary'>총 이용 금액</h3>
              <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
                <div className='flex-between'>
                  <span className='body2-14-medium text-text-neutral-secondary'>기존 결제금액</span>
                  <span className='body1-16-bold text-text-neutral-primary'>
                    {reportData?.data?.baseFee.toLocaleString()}원
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
                        (reportData?.data?.taxiFee || 0) + (reportData?.data?.extraTimeFee || 0)
                      ).toLocaleString()}
                      원
                    </span>
                  </div>
                  <div className='flex-between'>
                    <span className='body2-14-medium text-text-neutral-assistive'>택시 요금</span>
                    <span className='label3-12-medium text-text-neutral-secondary'>
                      {reportData?.data?.taxiFee.toLocaleString()}원
                    </span>
                  </div>
                  <div className='flex-between'>
                    <span className='body2-14-medium text-text-neutral-assistive'>
                      이용 시간 초과 요금
                    </span>
                    <span className='label3-12-medium text-text-neutral-secondary'>
                      {reportData?.data?.extraTimeFee.toLocaleString()}원
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
