import { Button, Divider, EscortCard, StrengthTag, TermsBottomSheet, Spinner } from '@components';
import { getRecruitById } from '@customer/apis';
import { GrayBox, InfoSection, RouteButton } from '@customer/components';
import { type EscortStrength } from '@types';
import type { RecruitDetailResponse } from '@customer/types';
import { IcCheck } from '@icons';
import { PageLayout } from '@layouts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { postApplicationByRecruitId, getRecruitList } from '@helper/apis';
import {
  dateFormat,
  formatImageUrl,
  timeDuration,
  timeFormat,
  timeFormatWithOptionalMinutes,
} from '@utils';

export const Route = createFileRoute('/helper/application/$escortId/')({
  component: RouteComponent,
});

const refineCardData = (recruitData: RecruitDetailResponse) => {
  const statusText = '동행번호 NO.' + recruitData.recruitId;
  const cardTitle =
    dateFormat(recruitData.escortDate, 'M월 d일 (eee)') +
    ', ' +
    recruitData.route.hospitalLocationInfo.placeName;
  const cardTimeText = `${dateFormat(recruitData.escortDate, 'M월 d일(eee)')} ${timeFormat(recruitData.estimatedMeetingTime)} ~ ${timeFormat(recruitData.estimatedReturnTime)}`;
  const cardLocationText = `${recruitData.route.meetingLocationInfo.placeName} → ${recruitData.route.hospitalLocationInfo.placeName}`;
  return { statusText, cardTitle, cardTimeText, cardLocationText };
};

function RouteComponent() {
  const navigate = useNavigate();
  const { escortId } = Route.useParams();
  const { data, isLoading } = getRecruitById(Number(escortId));
  const { data: recruitList } = getRecruitList();
  const isAlreadyApplied = recruitList?.data?.inProgressList.some(
    (recruit) => recruit.recruitId === Number(escortId)
  );
  const { status } = data?.data ?? {};
  const { mutate: postApplication } = postApplicationByRecruitId();
  const handleSubmit = () => {
    postApplication(
      {
        params: { path: { recruitId: Number(escortId) } },
      },
      {
        onSuccess: () => {
          navigate({
            to: '/helper/application/$escortId/completed',
            params: {
              escortId: escortId,
            },
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }
  if (!data || !data.data) {
    return null;
  }

  const recruitData = data.data;
  const { statusText, cardTitle, cardTimeText, cardLocationText } = refineCardData(recruitData);
  const {
    patient,
    escortDate,
    estimatedMeetingTime,
    estimatedReturnTime,
    route,
    purpose,
    extraRequest,
  } = recruitData;
  const { meetingLocationInfo, hospitalLocationInfo, returnLocationInfo } = route;
  const taglist = [];
  if (patient.needsHelping) {
    taglist.push('안전한 부축');
  }
  if (patient.usesWheelchair) {
    taglist.push('휠체어 이동');
  }
  if (patient.hasCognitiveIssue) {
    taglist.push('인지장애 케어');
  }

  return (
    <>
      <PageLayout.Header title='내역 상세보기' showBack />
      <PageLayout.Content className='overflow-y-auto'>
        <div className='bg-neutral-10 flex-col-start gap-[1.2rem] px-[2rem] py-[1.6rem]'>
          <EscortCard>
            <EscortCard.StatusHeader text={statusText} title={cardTitle} hasOnClickEvent={false} />
            <EscortCard.Divider />
            <EscortCard.InfoSection>
              <EscortCard.Info type='time' text={cardTimeText} />
              <EscortCard.Info type='location' text={cardLocationText} />
            </EscortCard.InfoSection>
          </EscortCard>
        </div>
        <>
          {/* 환자 및 동행 정보 */}
          <div className='flex flex-col gap-[1.6rem] p-[2rem]'>
            <div className='flex-start gap-[1.2rem]'>
              <img
                src={formatImageUrl(patient.imageUrl)}
                alt='환자 프로필'
                className='h-[5.6rem] w-[5.6rem] rounded-full object-cover'
              />
              <div className='flex flex-col gap-[0.4rem]'>
                <span className='subtitle-18-bold text-text-neutral-primary'>
                  {patient.name} 환자
                </span>
                <span className='label2-14-medium text-text-neutral-assistive'>
                  ({patient.age}세)/{patient.gender}
                </span>
              </div>
            </div>
            <div className='flex flex-col gap-[0.8rem]'>
              <div className='flex-start body1-16-medium gap-[2rem]'>
                <span className='text-text-neutral-primary'>동행 날짜</span>
                <span className='text-text-neutral-secondary'>
                  {dateFormat(escortDate, 'M월 d일 (eee)')}
                </span>
              </div>
              <div className='flex-start body1-16-medium gap-[2rem]'>
                <span className='text-text-neutral-primary'>동행 시간</span>
                <span className='text-text-neutral-secondary'>
                  {timeFormatWithOptionalMinutes(estimatedMeetingTime)} ~{' '}
                  {timeFormatWithOptionalMinutes(estimatedReturnTime)} (
                  {timeDuration(estimatedMeetingTime, estimatedReturnTime)})
                </span>
              </div>
              <div className='flex-start body1-16-medium gap-[2rem]'>
                <span className='text-text-neutral-primary'>동행 병원</span>
                <div className='flex-start gap-[0.8rem]'>
                  <span className='text-text-neutral-secondary'>
                    {hospitalLocationInfo.placeName}
                  </span>
                  {/* 이 지도보기 버튼의 onclick은 무엇을 해줘야 할까요 */}
                  <button className='caption2-10-medium text-text-neutral-secondary border-stroke-neutral-dark w-fit rounded-[0.4rem] border px-[0.5rem] py-[0.2rem]'>
                    지도 보기
                  </button>
                </div>
              </div>
            </div>
            <RouteButton
              LocationData={[meetingLocationInfo, hospitalLocationInfo, returnLocationInfo]}
            />
          </div>

          {/* 환자 상태 */}
          <div className='flex flex-col gap-[2.4rem] p-[2rem]'>
            <h3 className='subtitle-18-bold text-text-neutral-primary'>환자 상태</h3>
            <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
              <InfoSection title='보행 상태'>
                <div className='flex-start gap-[0.4rem]'>
                  {taglist.map((tag) => (
                    <StrengthTag key={tag} type={tag as EscortStrength} />
                  ))}
                </div>
              </InfoSection>
              <InfoSection
                title='인지 능력'
                status={patient.hasCognitiveIssue ? '도움이 필요해요' : '괜찮아요'}>
                {patient.hasCognitiveIssue && (
                  <GrayBox>
                    {patient.cognitiveIssueDetail?.map((detail, index) => (
                      <div className='flex-start' key={detail + index}>
                        <IcCheck />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </GrayBox>
                )}
              </InfoSection>
              <InfoSection
                title='의사소통'
                status={patient.hasCommunicationIssue ? '도움이 필요해요' : '괜찮아요'}>
                {patient.hasCommunicationIssue && (
                  <GrayBox>
                    <div className='flex-start'>{patient.communicationIssueDetail}</div>
                  </GrayBox>
                )}
              </InfoSection>
            </div>
            <Divider />

            {/* 진료시 참고 사항 */}
            <div>
              <h3 className='subtitle-18-bold text-text-neutral-primary'>진료시 참고 사항</h3>
              <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
                <InfoSection title='동행 목적'>
                  <GrayBox>
                    <span>{purpose}</span>
                  </GrayBox>
                </InfoSection>
                {extraRequest && (
                  <InfoSection title='요청사항'>
                    <GrayBox>
                      <span>{extraRequest}</span>
                    </GrayBox>
                  </InfoSection>
                )}
              </div>
            </div>
          </div>
        </>
      </PageLayout.Content>
      {status === '매칭중' && !isAlreadyApplied && (
        <PageLayout.Footer>
          <TermsBottomSheet onSubmit={handleSubmit}>
            <Button>지원하기</Button>
          </TermsBottomSheet>
        </PageLayout.Footer>
      )}
    </>
  );
}
