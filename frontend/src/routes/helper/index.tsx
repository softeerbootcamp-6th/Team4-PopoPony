import { createFileRoute, Link } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Button, EscortCard, Tabs } from '@components';
import { useState } from 'react';
import type { StatusType } from '@types';

export const Route = createFileRoute('/helper/')({
  component: RouteComponent,
});

interface EscortData {
  id: number;
  status: StatusType;
  escortDate: string;
  estimatedMettingTime: string;
  estimatedReturnTime: string;
  meetingPlaceName: string;
  destinationPlaceName: string;
}

const statusMessageMap = {
  matching: {
    text: '아직 매칭 확정되지 않았어요!',
  },
  'matching-confirmed': {
    text: '매칭이 확정되었어요!',
  },
  'on-meeting': {
    text: '동행자에게 이동해주세요.',
  },
  'going-to-hospital': {
    text: '병원으로 이동해주세요.',
  },
  'in-treatment': {
    text: '병원에서 진료중입니다.',
  },
  'returning-home': {
    text: '안전하게 복귀해주세요.',
  },
  'escort-completed': {
    text: '동행번호 NO.12394O4L',
  },
};

//TODO: 추후 api나왔을 땐 이 작업을 api단에서 해서, 필요한 상수들은 거기서 계산하도록 해도 될듯..?
const getEscortListNumber = (escortData: EscortData[]) => {
  const escortListLength = escortData.length;
  const completedEscortListLength = escortData.filter(
    (escort) => escort.status === 'escort-completed'
  ).length;
  const matchingEscortListLength = escortListLength - completedEscortListLength;
  return { completedEscortListLength, matchingEscortListLength };
};

const refineEscortData = (escortData: EscortData) => {}

function RouteComponent() {
  const hasProfile = false;
  //TODO: 추후 api call로 전환
  const escortListData = [escortData];
  const { completedEscortListLength, matchingEscortListLength } =
    getEscortListNumber(escortListData);
  return (
    <PageLayout>
      <PageLayout.Content>
        <div className='bg-neutral-10 relative h-full max-h-[22rem] px-[2rem] py-[1rem] pb-[2rem]'>
          <div className='absolute z-10 w-[calc(100%-4rem)]'>
            <img src='/images/logo-text.svg' alt='logo-text' className='w-[4rem]' />
            <h2 className='headline-24-bold text-text-neutral-primary mt-[2.4rem] mb-[3rem]'>
              토닥과 함께 <br />
              안전하게 동행하세요!
            </h2>
            <div className='flex-between flex w-full gap-[1.2rem]'>
              <div className='flex-1'>
                <Link
                  to={hasProfile ? '/helper/profile' : '/helper/profile/new/$step'}
                  params={{ step: 'profile' }}>
                  <Button variant='assistive' size='md'>
                    <span className='text-text-neutral-primary'>
                      {hasProfile ? '프로필 바로가기' : '프로필 작성하기'}
                    </span>
                  </Button>
                </Link>
              </div>
              <div className='flex-1'>
                <Link to='/helper/escort'>
                  <Button size='md'>
                    <span className='text-text-neutral-0'>일감찾기</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <img
            src='/images/home-graphic.svg'
            alt='home'
            className='absolute top-[-4.4rem] right-0 w-[24.8rem]'
          />
        </div>

        <Tabs defaultValue='신청'>
          <Tabs.TabsList>
            <Tabs.TabsTrigger value='신청'>
              신청
              <span className='group-data-[state=active]:text-text-mint-primary'>
                {matchingEscortListLength}
              </span>
            </Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='완료'>
              완료
              <span className='group-data-[state=active]:text-text-mint-primary'>
                {completedEscortListLength}
              </span>
            </Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='신청'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              <EscortCard>
                <EscortCard.StatusHeader
                  status='matching'
                  text='3명이 현재 지원 중이에요!'
                  title='7월 22일 (토), 서울아산병원'
                />
                <EscortCard.Divider />
                <EscortCard.InfoSection>
                  <EscortCard.Info type='time' text='7월 22일(토) 12시 ~ 15시' />
                  <EscortCard.Info type='location' text='꿈에그린아파트 → 서울아산병원' />
                  <EscortCard.Info type='price' text='123,456원' />
                </EscortCard.InfoSection>
                <EscortCard.Tag tags={['support', 'wheelchair', 'care']} />
              </EscortCard>
              <EscortCard>
                <EscortCard.StatusHeader
                  status='matching'
                  text='동행번호 NO.12394O4L'
                  title='7월 22일 (토), 서울아산병원'
                />
                <EscortCard.Divider />
                <EscortCard.InfoSection>
                  <EscortCard.Info type='time' text='7월 22일(토) 12시 ~ 15시' />
                  <EscortCard.Info type='location' text='꿈에그린아파트 → 서울아산병원' />
                  <EscortCard.Info type='price' text='123,456원' />
                </EscortCard.InfoSection>
                <EscortCard.Button onClick={() => {}} />
              </EscortCard>
              <EscortCard>
                <EscortCard.StatusHeader
                  status='matching'
                  text='동행번호 NO.12394O4L'
                  title='7월 22일 (토), 서울아산병원'
                />
                <EscortCard.Divider />
                <EscortCard.InfoSection>
                  <EscortCard.Info type='time' text='7월 22일(토) 12시 ~ 15시' />
                  <EscortCard.Info type='location' text='꿈에그린아파트 → 서울아산병원' />
                  <EscortCard.Info type='price' text='123,456원' />
                </EscortCard.InfoSection>
                <EscortCard.Tag tags={['support', 'wheelchair', 'care']} />
              </EscortCard>
              <EscortCard>
                <EscortCard.StatusHeader
                  status='matching'
                  text='동행번호 NO.12394O4L'
                  title='7월 22일 (토), 서울아산병원'
                />
                <EscortCard.Divider />
                <EscortCard.InfoSection>
                  <EscortCard.Info type='time' text='7월 22일(토) 12시 ~ 15시' />
                  <EscortCard.Info type='location' text='꿈에그린아파트 → 서울아산병원' />
                  <EscortCard.Info type='price' text='123,456원' />
                </EscortCard.InfoSection>
                <EscortCard.Button onClick={() => {}} />
              </EscortCard>
            </div>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='완료'>Change your 완료 here.</Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
    </PageLayout>
  );
}
