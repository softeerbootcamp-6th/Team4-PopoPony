import { Button, Modal, StrengthTag, Tabs } from '@components';
import { getHelperById } from '@customer/apis';
import { KeywordTag, ReviewCard, SatisfactionGraph, StatsSummaryCard } from '@customer/components';
import { useModal } from '@hooks';
import { IcPhoneFill, IcVerified } from '@icons';
import { PageLayout } from '@layouts';
import { createFileRoute } from '@tanstack/react-router';
import type { EscortStrength } from '@types';

export const Route = createFileRoute('/customer/escort/$escortId/helper/$helperId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isOpen, openModal, closeModal } = useModal();
  const { helperId } = Route.useParams();
  const { data } = getHelperById(Number(helperId));
  const { helperSimple, escortCount = 0, reviewStat } = data?.data || {};
  const { imageUrl, name, gender, age, shortBio, contact, certificateList, strengthList } =
    helperSimple || {};

  return (
    <PageLayout>
      <PageLayout.Header title='도우미' showBack />
      <PageLayout.Content>
        <div className='flex flex-col gap-[0.8rem] px-[2rem] py-[1.6rem]'>
          <div className='flex-start gap-[1.2rem]'>
            <img
              src={imageUrl || '/images/default-profile.svg'}
              alt='도우미 프로필'
              className='h-[5.6rem] w-[5.6rem] object-cover'
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
              window.open(`tel:${contact}`, '_blank');
            }}>
            <IcPhoneFill className='[&_path]:fill-icon-neutral-primary' />
            <span className='ml-[0.8rem]'>도우미에게 전화걸기</span>
          </Button>
          <div className='mt-[0.8rem]'>
            <StatsSummaryCard
              count={escortCount}
              recommendRate={reviewStat?.goodRate || 0}
              reviewCount={reviewStat?.reviewCount || 0}
            />
          </div>
        </div>

        <Tabs defaultValue='동행후기'>
          <Tabs.TabsList>
            <Tabs.TabsTrigger value='자기소개'>자기소개</Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='동행후기'>동행후기</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='자기소개'>
            <Tabs.TabsContentSection gap='gap-[2rem]'>
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
                <KeywordTag text='소통이 잘돼요' count={10} />
                <div className='flex gap-[1.6rem] overflow-x-auto'>
                  <ReviewCard status='good' date='2025-01-01' content='소통이 잘돼요' />
                  <ReviewCard status='average' date='2025-01-01' content='소통이 잘돼요' />
                  <ReviewCard status='bad' date='2025-01-01' content='소통이 잘돼요' />
                  <ReviewCard status='good' date='2025-01-01' content='소통이 잘돼요' />
                </div>
              </div>
            </Tabs.TabsContentSection>
          </Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button onClick={openModal}>도우미 선택하기</Button>
      </PageLayout.Footer>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <Modal.Title>{name}님을 선택하시겠어요?</Modal.Title>
        <Modal.Content>선택 후에는 도우미를 변경할 수 없어요.</Modal.Content>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton
            onClick={() => {
              alert('준비중인 기능이에요');
              closeModal();
            }}>
            선택하기
          </Modal.ConfirmButton>
          <Modal.CloseButton onClick={closeModal}>돌아가기</Modal.CloseButton>
        </Modal.ButtonContainer>
      </Modal>
    </PageLayout>
  );
}
