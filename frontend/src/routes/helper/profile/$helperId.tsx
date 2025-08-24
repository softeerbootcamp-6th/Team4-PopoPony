import { Button, StrengthTag, Tabs } from '@shared/ui';
import { getHelperById } from '@customer/apis';
import { KeywordTag, ReviewCard, SatisfactionGraph, StatsSummaryCard } from '@customer/components';
import { IcVerified } from '@icons';
import { PageLayout } from '@shared/ui/layout';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import type { EscortStrength } from '@shared/types';
import { dateFormat, formatImageUrl } from '@shared/lib';

export const Route = createFileRoute('/helper/profile/$helperId')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { helperId } = useParams({ from: '/helper/profile/$helperId' });
  const { data } = getHelperById(Number(helperId));
  const {
    helperSimple,
    escortCount = 0,
    reviewStat = { goodRate: 0, averageRate: 0, badRate: 0, reviewCount: 0 },
    positiveFeedbackStatList = [],
    latestReviewList = [],
  } = data?.data || {};

  const statusMap = {
    좋았어요: 'good',
    괜찮아요: 'average',
    아쉬워요: 'bad',
  } as const;

  const { imageUrl, name, gender, age, shortBio, certificateList, strengthList } =
    helperSimple || {};

  return (
    <>
      <PageLayout.Header title='도우미' showBack />
      <PageLayout.Content>
        <div className='flex flex-col gap-[0.8rem] px-[2rem] py-[1.6rem]'>
          <div className='flex-start gap-[1.2rem]'>
            <img
              src={formatImageUrl(imageUrl)}
              alt='도우미 프로필'
              className='h-[5.6rem] w-[5.6rem] rounded-full object-cover'
            />
            <div className='flex flex-col gap-[0.4rem]'>
              <div>
                <span className='subtitle-18-bold text-text-neutral-primary'>{`${name} 도우미`}</span>
                <span className='label2-14-medium text-text-neutral-assistive ml-[0.6rem]'>
                  ({age}세)/{gender?.charAt(0)}
                </span>
              </div>
              <div className='label3-12-medium text-text-neutral-secondary'>{shortBio}</div>
            </div>
          </div>
          <Button
            variant='secondary'
            size='md'
            onClick={() => {
              navigate({
                to: '/helper/profile/new/$step',
                params: {
                  step: 'region',
                },
              });
            }}>
            <span className='ml-[0.8rem]'>수정하기</span>
          </Button>
          <div className='mt-[0.8rem]'>
            <StatsSummaryCard
              count={escortCount}
              recommendRate={reviewStat?.goodRate || 0}
              reviewCount={reviewStat?.reviewCount || 0}
            />
          </div>
        </div>

        <Tabs defaultValue='자기소개'>
          <Tabs.TabsList withHeader>
            <Tabs.TabsTrigger value='자기소개'>자기소개</Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='동행후기'>동행후기</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='자기소개'>
            <Tabs.TabsContentSection gap='gap-[2rem]'>
              <div className='shadow-card border-stroke-neutral-dark flex flex-col gap-[2.4rem] rounded-[0.8rem] border px-[1.6rem] py-[2.4rem]'>
                <div className='flex flex-col gap-[1.6rem]'>
                  <h3 className='subtitle-18-bold text-text-neutral-primary'>자격 사항</h3>
                  <ul className='flex flex-col gap-[0.8rem]'>
                    {certificateList?.map((certificate) => (
                      <li
                        key={certificate}
                        className='flex-start border-neutral-20 h-[4rem] gap-[0.4rem] rounded-[0.4rem] border p-[0.8rem]'>
                        <IcVerified />
                        <span className='label3-12-medium text-text-neutral-primary'>
                          {certificate}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='flex flex-col gap-[1.6rem]'>
                  <h3 className='subtitle-18-bold text-text-neutral-primary'>나만의 강점</h3>
                  <ul className='flex flex-wrap gap-[0.8rem]'>
                    {strengthList?.map((strength) => (
                      <li key={strength}>
                        <StrengthTag type={strength as EscortStrength} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Tabs.TabsContentSection>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='동행후기'>
            <Tabs.TabsContentSection>
              <div className='flex flex-col gap-[1.6rem]'>
                <h3 className='subtitle-18-bold text-text-neutral-primary'>지원자 만족도</h3>
                <SatisfactionGraph
                  goodRate={reviewStat?.goodRate || 0}
                  averageRate={reviewStat?.averageRate || 0}
                  badRate={reviewStat?.badRate || 0}
                />
              </div>
            </Tabs.TabsContentSection>
            <Tabs.TabsDivider />
            <Tabs.TabsContentSection>
              <div className='flex flex-col gap-[1.6rem]'>
                <h3 className='subtitle-18-bold text-text-neutral-primary'>동행후기</h3>
                <div className='flex-start flex-wrap gap-[0.8rem]'>
                  {positiveFeedbackStatList?.map((stat) => (
                    <KeywordTag key={stat.description} text={stat.description} count={stat.count} />
                  ))}
                </div>
                <div className='flex gap-[1.6rem] overflow-x-auto'>
                  {latestReviewList?.map((review) => (
                    <ReviewCard
                      key={review.reviewId}
                      status={statusMap[review.satisfactionLevel as keyof typeof statusMap]}
                      date={dateFormat(review.createdAt, 'yyyy. MM. dd')}
                      content={review.shortComment || ''}
                    />
                  ))}
                </div>
              </div>
            </Tabs.TabsContentSection>
          </Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
    </>
  );
}
