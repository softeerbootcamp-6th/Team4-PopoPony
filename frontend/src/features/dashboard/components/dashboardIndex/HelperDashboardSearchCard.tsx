import { IcArriveMarker, IcArrowRotateRight01 } from '@icons';
import { IcAirplane, IcBusFill, IcFerry, IcStartMarker, IcSubwayFill, IcWalk } from '@icons';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useEffect, useState } from 'react';

import { cn } from '@shared/lib';
import { Button, ErrorSuspenseBoundary } from '@shared/ui';

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
const TransportIcon = ({
  mode,
  color,
  className,
}: {
  mode: string;
  color?: string;
  className?: string;
}) => {
  const hex = color ? (color.startsWith('#') ? color : `#${color}`) : undefined;
  const colorClass = hex ? `bg-[${hex}]` : 'bg-bg-neutral-tertiary';
  const getIcon = () => {
    switch (mode) {
      case 'WALK':
        return <IcWalk className='[&_path]:fill-icon-neutral-secondary h-[3rem]' />;
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
    return <div className={className}>{getIcon()}</div>;
  }

  return (
    <div
      className={cn(
        'flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-full',
        colorClass,
        className
      )}
      style={{
        backgroundColor: hex,
      }}>
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
        <div className='flex justify-between'>
          <div className='flex-center flex-1 flex-col'>
            <p className='body2-14-medium text-text-neutral-secondary'>예상 소요시간</p>
            <p className='headline-24-bold text-text-neutral-primary mt-[0.4rem]'>
              {formatDuration(totalTimeSec)}
            </p>
          </div>
          <div className='bg-stroke-neutral-light h-[5rem] w-[0.3rem]' />
          <div className='flex-center flex-1 flex-col'>
            <p className='body2-14-medium text-text-neutral-secondary'>예상 도착시간</p>
            <p className='headline-24-bold text-text-neutral-primary mt-[0.4rem]'>
              {formatArrival(totalTimeSec)}
            </p>
          </div>
        </div>
      </div>

      <div className='mt-[1.6rem] overflow-x-visible'>
        <ul className='flex flex-col'>
          {/* 출발지 표시 */}
          <li className='flex items-center gap-[1.2rem]'>
            <div className='bg-status-destructive-primary flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-full'>
              <IcStartMarker className='h-[2.4rem]' />
            </div>
            <span className='body1-16-medium text-text-neutral-primary'>출발</span>
          </li>
          {legs.map((leg: TmapLeg, idx: number) => {
            const mode = leg.mode ?? '';
            const hex = leg.routeColor
              ? leg.routeColor.startsWith('#')
                ? leg.routeColor
                : `#${leg.routeColor}`
              : '#00C89A';
            const time = leg.sectionTime ? formatDuration(leg.sectionTime) : undefined;
            if (mode === 'WALK') {
              return (
                <li key={idx} className='flex h-[6rem] items-center gap-[1.2rem]'>
                  <div className='border-stroke-neutral-dark relative ml-[1rem] flex h-full items-center overflow-visible border-l-2 border-dotted'>
                    <span className='body2-14-medium text-text-neutral-secondary pl-[2.5rem]'>
                      도보로 이동 {time ? `(${time})` : ''}
                    </span>
                    <TransportIcon
                      mode={mode}
                      color={hex}
                      className='absolute top-1/2 left-[-0.75rem] -translate-y-1/2'
                    />
                  </div>
                </li>
              );
            }

            if (mode === 'SUBWAY') {
              const line = (leg.laneName || leg.route || '').replace('(급행)', '').trim();
              const lineColor = hex;
              return (
                <li key={idx} className='flex h-[6rem] items-center gap-[1.2rem]'>
                  <div
                    className='relative ml-[1rem] flex h-full items-center overflow-visible border-l-2 pl-[1.5rem]'
                    style={{ borderColor: lineColor }}>
                    <TransportIcon
                      mode={mode}
                      color={lineColor}
                      className='absolute top-0 left-[-1.3rem]'
                    />
                    <div className='flex h-full flex-col justify-between pl-[1rem]'>
                      <span className='body1-16-bold' style={{ color: lineColor }}>
                        {line || '지하철'}
                      </span>
                      <span className='body2-14-medium text-text-neutral-secondary relative top-[0.7rem]'>
                        {leg.start?.name ?? ''} 승차 → {leg.end?.name ?? ''} 하차{' '}
                        {time ? `(${time})` : ''}
                      </span>
                    </div>
                    <div
                      className='absolute bottom-0 left-[-0.5rem] h-[0.8rem] w-[0.8rem] rounded-full'
                      style={{ backgroundColor: hex }}></div>
                  </div>
                </li>
              );
            }

            if (mode === 'BUS') {
              const busNo = leg.route || '버스';
              const lineColor = hex;
              return (
                <li key={idx} className='flex h-[6rem] items-center gap-[1.2rem]'>
                  <div
                    className='relative ml-[1rem] flex h-full items-center overflow-visible border-l-2 pl-[1.5rem]'
                    style={{ borderColor: lineColor }}>
                    <TransportIcon
                      mode={mode}
                      color={lineColor}
                      className='absolute top-0 left-[-1.3rem]'
                    />
                    <div className='flex h-full flex-col justify-between pl-[1rem]'>
                      <span className='body1-16-bold' style={{ color: lineColor }}>
                        {busNo}
                      </span>
                      <span className='body2-14-medium text-text-neutral-secondary relative top-[0.7rem]'>
                        {leg.start?.name ?? ''} 승차 → {leg.end?.name ?? ''} 하차{' '}
                        {time ? `(${time})` : ''}
                      </span>
                    </div>
                    <div
                      className='absolute bottom-0 left-[-0.5rem] h-[0.8rem] w-[0.8rem] rounded-full'
                      style={{ backgroundColor: hex }}></div>
                  </div>
                </li>
              );
            }

            if (mode === 'AIRPLANE') {
              const lineColor = hex;
              return (
                <li key={idx} className='flex h-[6rem] items-center gap-[1.2rem]'>
                  <div
                    className='relative ml-[1rem] flex h-full items-center overflow-visible border-l-2 pl-[1.5rem]'
                    style={{ borderColor: lineColor }}>
                    <TransportIcon
                      mode={mode}
                      color={lineColor}
                      className='absolute top-0 left-[-1.3rem]'
                    />
                    <span className='body1-16-bold pl-[1rem]' style={{ color: lineColor }}>
                      항공편 이용 {time ? `(${time})` : ''}
                    </span>
                    <div
                      className='absolute bottom-0 left-[-0.5rem] h-[0.8rem] w-[0.8rem] rounded-full'
                      style={{ backgroundColor: hex }}></div>
                  </div>
                </li>
              );
            }

            if (mode === 'FERRY') {
              const lineColor = hex;
              return (
                <li key={idx} className='flex h-[6rem] items-center gap-[1.2rem]'>
                  <div
                    className='relative ml-[1rem] flex h-full items-center overflow-visible border-l-2 pl-[1.5rem]'
                    style={{ borderColor: lineColor }}>
                    <TransportIcon
                      mode={mode}
                      color={lineColor}
                      className='absolute top-0 left-[-1.3rem]'
                    />
                    <span className='body1-16-bold pl-[1rem]' style={{ color: lineColor }}>
                      해운 이용 {time ? `(${time})` : ''}
                    </span>
                    <div
                      className='absolute bottom-0 left-[-0.5rem] h-[0.8rem] w-[0.8rem] rounded-full'
                      style={{ backgroundColor: hex }}></div>
                  </div>
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
          <li className='flex items-center gap-[1.2rem]'>
            <div className='bg-status-destructive-primary flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-full'>
              <IcArriveMarker className='h-[2.4rem]' />
            </div>
            <span className='body1-16-medium text-text-neutral-primary'>도착</span>
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

  // Auto-trigger search on mount
  useEffect(() => {
    if (!origin) {
      if (!('geolocation' in navigator)) return;
      navigator.geolocation.getCurrentPosition((pos) => {
        setOrigin({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      });
    }
  }, []);

  return (
    <DashBoardCard.Card>
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
