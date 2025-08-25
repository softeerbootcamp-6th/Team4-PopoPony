import { IcArrowRotateRight01 } from '@icons';
import { IcAirplane, IcBusFill, IcFerry, IcMarkFill, IcSubwayFill, IcWalk } from '@icons';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useState } from 'react';

import { Button, ErrorSuspenseBoundary } from '@shared/ui';
import { cn } from '@shared/lib';

import { postTmapTransport } from '@dashboard/apis';

import DashBoardCard from '../DashBoardCard';

interface HelperDashboardSearchCardProps {
  destination: { lat: number; lon: number };
}

const formatDuration = (seconds?: number) => {
  if (!seconds || seconds <= 0) return '-';
  const m = Math.round(seconds / 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h > 0 ? `${h}시간 ${mm}분` : `${mm}분`;
};

const formatArrival = (seconds?: number) => {
  if (!seconds || seconds <= 0) return '-';
  const d = new Date(Date.now() + seconds * 1000);
  const hour = d.getHours();
  const min = d.getMinutes().toString().padStart(2, '0');
  const isPM = hour >= 12;
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${isPM ? '오후' : '오전'} ${h12}:${min}`;
};

type TmapLeg = {
  mode?: string;
  sectionTime?: number;
  route?: string;
  start?: { name?: string };
  end?: { name?: string };
  laneName?: string;
  routeColor?: string;
  distance?: number;
  totalWalkDistance?: number;
};

type TmapItinerary = {
  totalTime?: number;
  transferCount?: number;
  totalWalkDistance?: number;
  totalDistance?: number;
  totalWalkTime?: number;
  fare?: {
    regular?: {
      totalFare?: number;
      currency?: {
        symbol?: string;
        currency?: string;
        currencyCode?: string;
      };
    };
  };
  legs?: TmapLeg[];
};

type TmapResponse = {
  metaData?: { plan?: { itineraries?: TmapItinerary[] } };
  plan?: { itineraries?: TmapItinerary[] };
  status?: number;
  message?: string;
};

// 교통수단 아이콘 컴포넌트
const TransportIcon = ({ mode, color }: { mode: string; color?: string }) => {
  const colorClass = color ? `bg-[#${color}]` : 'bg-bg-neutral-tertiary';
  const getIcon = () => {
    switch (mode) {
      case 'WALK':
        return <IcWalk className='h-[1.6rem] w-[1.6rem] [&_path]:fill-icon-neutral-secondary' />;
      case 'SUBWAY':
        return <IcSubwayFill className='h-[1.6rem] w-[1.6rem] [&_path]:fill-white' />;
      case 'BUS':
        return <IcBusFill className='h-[1.6rem] w-[1.6rem] [&_path]:fill-white' />;
      case 'AIRPLANE':
        return <IcAirplane className='h-[1.6rem] w-[1.6rem] [&_path]:fill-white' />;
      case 'FERRY':
        return <IcFerry className='h-[1.6rem] w-[1.6rem] [&_path]:fill-white' />;
      default:
        return <IcWalk className='h-[1.6rem] w-[1.6rem] [&_path]:fill-white' />;
    }
  };

  if (mode === 'WALK') {
    return (
      <div className='flex items-center'>
        <div className='h-[0.2rem] w-[1.2rem] border-t-[0.2rem] border-dotted border-border-neutral-secondary' />
        <div className='mx-[0.4rem] flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-full bg-bg-neutral-tertiary'>
          {getIcon()}
        </div>
        <div className='h-[0.2rem] w-[1.2rem] border-t-[0.2rem] border-dotted border-border-neutral-secondary' />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-full',
        colorClass,
      )}>
      {getIcon()}
    </div>
  );
};

const TransportResult = ({
  origin,
  destination,
}: {
  origin: { lat: number; lon: number } | null;
  destination: { lat: number; lon: number };
}) => {
  const { data } = useSuspenseQuery<TmapResponse>({
    queryKey: ['tmapTransport', origin, destination],
    queryFn: async () => {
      if (!origin) throw new Error('origin missing');
      const res = await postTmapTransport({
        startX: String(origin.lon),
        startY: String(origin.lat),
        endX: String(destination.lon),
        endY: String(destination.lat),
      });
      return res as TmapResponse;
    },
  });

  // API 응답 상태 확인
  if (data?.status && data.status !== 200) {
    return (
      <div className='label1-12-medium text-text-status-destructive'>
        {data.message || '경로 탐색 중 오류가 발생했습니다.'}
      </div>
    );
  }

  const itinerary =
    data?.metaData?.plan?.itineraries?.[0] ?? data?.plan?.itineraries?.[0] ?? undefined;
  const totalTimeSec: number | undefined = itinerary?.totalTime;
  const legs: TmapLeg[] = itinerary?.legs ?? [];

  if (!origin) {
    return (
      <div className='label1-12-medium text-text-neutral-secondary'>
        출발지를 선택하면 경로가 표시됩니다.
      </div>
    );
  }

  return (
    <>
      <div className='mt-[1.6rem]'>
        <div className='flex items-center gap-[2.4rem]'>
          <div>
            <p className='label1-12-medium text-text-neutral-secondary'>예상 소요시간</p>
            <p className='headline-24-bold text-text-neutral-primary mt-[0.4rem]'>
              {formatDuration(totalTimeSec)}
            </p>
          </div>
          <div className='bg-stroke-neutral-light h-[3.6rem] w-[0.1rem]' />
          <div>
            <p className='label1-12-medium text-text-neutral-secondary'>예상 도착시간</p>
            <p className='headline-24-bold text-text-neutral-primary mt-[0.4rem]'>
              {formatArrival(totalTimeSec)}
            </p>
          </div>
        </div>
      </div>

      <div className='mt-[1.6rem] max-h-[32rem] overflow-y-auto pr-[0.4rem]'>
        <ul className='flex flex-col gap-[1.2rem]'>
          {/* 출발지 표시 */}
          <li className='flex items-center gap-[1.2rem]'>
            <div className='flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-full bg-status-destructive-primary'>
              <IcMarkFill className='h-[1.6rem] w-[1.6rem] [&_path]:fill-white' />
            </div>
            <span className='body2-14-medium text-text-neutral-primary'>출발</span>
          </li>
          {legs.map((leg: TmapLeg, idx: number) => {
            const mode = leg.mode ?? '';

            if (mode === 'WALK') {
              return (
                <li key={idx} className='flex items-center gap-[1.2rem]'>
                  <TransportIcon mode={mode} />
                  <span className='body2-14-medium text-text-neutral-secondary'>도보로 이동</span>
                </li>
              );
            }

            if (mode === 'SUBWAY') {
              const line = (leg.laneName || leg.route || '').replace('(급행)', '').trim();
              const lineColor = leg.routeColor || '#666';
              return (
                <li key={idx} className='flex items-center gap-[1.2rem]'>
                  <TransportIcon mode={mode} color={lineColor} />
                  <div className='flex flex-col gap-[0.2rem]'>
                    <span className='body2-14-medium text-text-neutral-primary'>
                      {line || '지하철'} {leg.start?.name ?? ''}
                    </span>
                    <span className='body2-14-medium text-text-neutral-secondary'>
                      {leg.start?.name ?? ''} 승차 → {leg.end?.name ?? ''} 하차
                    </span>
                  </div>
                </li>
              );
            }

            if (mode === 'BUS') {
              const busNo = leg.route || '버스';
              const busColor = leg.routeColor || '#1DA1F2';
              return (
                <li key={idx} className='flex items-center gap-[1.2rem]'>
                  <TransportIcon mode={mode} color={busColor} />
                  <div className='flex flex-col gap-[0.2rem]'>
                    <span className='body2-14-medium text-text-neutral-primary'>
                      {busNo} {leg.start?.name ?? ''}
                    </span>
                    <span className='body2-14-medium text-text-neutral-secondary'>
                      {leg.start?.name ?? ''} 승차 → {leg.end?.name ?? ''} 하차
                    </span>
                  </div>
                </li>
              );
            }

            if (mode === 'AIRPLANE') {
              return (
                <li key={idx} className='flex items-center gap-[1.2rem]'>
                  <TransportIcon mode={mode} color={leg.routeColor || '#1DA1F2'} />
                  <span className='body2-14-medium text-text-neutral-primary'>항공편 이용</span>
                </li>
              );
            }

            if (mode === 'FERRY') {
              return (
                <li key={idx} className='flex items-center gap-[1.2rem]'>
                  <TransportIcon mode={mode} color={leg.routeColor || '#4ECDC4'} />
                  <span className='body2-14-medium text-text-neutral-primary'>해운 이용</span>
                </li>
              );
            }

            return (
              <li key={idx} className='flex items-center gap-[1.2rem]'>
                <TransportIcon mode='WALK' />
                <span className='body2-14-medium text-text-neutral-secondary'>기타 이동</span>
              </li>
            );
          })}
          {/* 도착지 표시 */}
          <li className='flex items-center gap-[1.2rem]'>
            <div className='flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-full bg-status-success-primary'>
              <IcMarkFill className='h-[1.6rem] w-[1.6rem] [&_path]:fill-white' />
            </div>
            <span className='body2-14-medium text-text-neutral-primary'>도착</span>
          </li>
        </ul>
      </div>
    </>
  );
};

const HelperDashboardSearchCard = ({ destination }: HelperDashboardSearchCardProps) => {
  const [origin, setOrigin] = useState<{ lat: number; lon: number } | null>(null);

  const handleSearch = () => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setOrigin({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
  };

  return (
    <DashBoardCard.Card className='h-[50rem]'>
      <div className='flex-between'>
        <h4 className='title-20-bold text-text-neutral-primary'>최적 경로</h4>
        <div className='w-[13rem]'>
          <Button variant='secondary' size='sm' onClick={handleSearch}>
            <div className='flex-start flex gap-[0.4rem]'>
              <IcArrowRotateRight01 className='[&_path]:fill-icon-neutral-primary h-[1.6rem] w-[1.6rem]' />
              현 위치에서 검색
            </div>
          </Button>
        </div>
      </div>

      <div className='mt-[1.6rem]'>
        <ErrorSuspenseBoundary>
          {!origin ? (
            <div className='label1-12-medium text-text-neutral-secondary'>
              출발지를 선택하면 경로가 표시됩니다.
            </div>
          ) : (
            <TransportResult origin={origin} destination={destination} />
          )}
        </ErrorSuspenseBoundary>
      </div>
    </DashBoardCard.Card>
  );
};

export default HelperDashboardSearchCard;
