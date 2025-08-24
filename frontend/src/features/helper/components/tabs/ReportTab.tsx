import { Tabs, Divider } from '@shared/ui';
import { InfoSection, WarningBox } from '@customer/components';
import { IcAlertCircle } from '@icons';
import { getRecruitReportByRecruitId, getRecruitReviewByRecruitId } from '@helper/apis';
import { useParams } from '@tanstack/react-router';
import { dateFormat, timeFormat } from '@shared/lib';

const statusMap = {
  좋았어요: 'good',
  괜찮아요: 'average',
  아쉬워요: 'bad',
} as const;

const ReportTab = () => {
  const { escortId } = useParams({ from: '/helper/escort/$escortId/' });
  const { data: reportData } = getRecruitReportByRecruitId(Number(escortId));
  const isValidReport = reportData?.status === 200;

  const { data: reviewData } = getRecruitReviewByRecruitId(Number(escortId), true);
  const { positiveFeedbackList, shortComment, satisfactionLevel } = reviewData?.data || {};

  const {
    actualMeetingTime,
    actualReturnTime,
    extraMinutes,
    nextAppointmentTime,
    hasNextAppointment,
    description,
    baseFee,
    taxiFee,
    extraTimeFee,
  } = reportData?.data || {};

  return (
    <>
      <Tabs.TabsContentSection>
        {reviewData && reviewData.status === 200 && (
          <div>
            <div className='border-stroke-neutral-dark flex flex-col gap-[1.2rem] rounded-[0.8rem] border px-[1.6rem] py-[1.2rem]'>
              <div className='flex-start gap-[1.2rem]'>
                <img
                  src={`/images/status-${statusMap[satisfactionLevel as keyof typeof statusMap]}.svg`}
                  alt={`status-${statusMap[satisfactionLevel as keyof typeof statusMap]}`}
                  className='h-[4rem] w-[4rem]'
                />
                <div className='flex flex-col gap-[0.2rem]'>
                  <h6 className='body2-14-bold text-text-neutral-primary'>{satisfactionLevel}</h6>
                  <p className='body2-14-medium text-text-neutral-primary'>{shortComment}</p>
                </div>
              </div>
              <Divider />
              <div className='flex flex-col'>
                {positiveFeedbackList && positiveFeedbackList?.length > 0 && (
                  <div className='flex gap-[0.8rem]'>
                    <div className='label2-14-bold text-text-neutral-secondary mt-[0.4rem] w-[6rem]'>
                      좋은 점
                    </div>
                    <div className='flex-start flex-wrap gap-[0.4rem]'>
                      {positiveFeedbackList?.map((item, index) => (
                        <div
                          className='flex-center label2-14-medium bg-neutral-10 text-text-neutral-secondary h-[2.8rem] rounded-[0.4rem] px-[0.8rem]'
                          key={index}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isValidReport && (
          <>
            <h3 className='subtitle-18-bold text-text-neutral-primary mt-[2rem]'>동행 리포트</h3>
            <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
              <InfoSection title='진행 시간'>
                {actualMeetingTime && actualReturnTime ? (
                  <span className='body1-16-bold text-text-neutral-primary'>
                    {timeFormat(actualMeetingTime, 'aaa HH:mm')} ~{' '}
                    {timeFormat(actualReturnTime, 'aaa HH:mm')}
                  </span>
                ) : (
                  <span className='body1-16-medium text-text-neutral-secondary'>-</span>
                )}
                {extraMinutes && extraMinutes > 0 ? (
                  <div className='flex-start gap-[0.4rem]'>
                    <IcAlertCircle
                      className='[&_path]:fill-icon-red-primary'
                      width={16}
                      height={16}
                    />
                    <span className='label3-12-medium text-text-red-primary'>
                      예상 동행 시간보다 {extraMinutes}분 초과되었어요!
                    </span>
                  </div>
                ) : null}
              </InfoSection>
              <Divider />
              {hasNextAppointment && (
                <>
                  <InfoSection title='다음 예약'>
                    <span className='body1-16-medium text-text-neutral-primary'>
                      {nextAppointmentTime &&
                        dateFormat(nextAppointmentTime, 'yyyy년 MM월 dd일 aaa HH시 mm분')}
                    </span>
                  </InfoSection>
                  <Divider />
                </>
              )}

              <InfoSection title='전달 내용'>
                <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary flex flex-col rounded-[0.6rem] p-[1rem]'>
                  <span>{description || '-'}</span>
                </div>
              </InfoSection>
            </div>

            {/* 이용 금액 */}
            <div>
              <h3 className='subtitle-18-bold text-text-neutral-primary'>총 이용 금액</h3>
              <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
                <div className='flex-between'>
                  <span className='body2-14-medium text-text-neutral-secondary'>기존 결제금액</span>
                  <span className='body1-16-bold text-text-neutral-primary'>
                    {baseFee?.toLocaleString()}원
                  </span>
                </div>
                <Divider />
                <div className='flex flex-col gap-[0.8rem]'>
                  <div className='flex-between'>
                    <span className='body2-14-medium text-text-neutral-secondary'>
                      추가 결제금액
                    </span>
                    <span className='body1-16-bold text-text-neutral-primary'>
                      {((taxiFee || 0) + (extraTimeFee || 0)).toLocaleString()}원
                    </span>
                  </div>
                  <div className='flex-between'>
                    <span className='body2-14-medium text-text-neutral-assistive'>택시 요금</span>
                    <span className='label3-12-medium text-text-neutral-secondary'>
                      {taxiFee?.toLocaleString()}원
                    </span>
                  </div>
                  <div className='flex-between'>
                    <span className='body2-14-medium text-text-neutral-assistive'>
                      이용 시간 초과 요금
                    </span>
                    <span className='label3-12-medium text-text-neutral-secondary'>
                      {extraTimeFee?.toLocaleString()}원
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
