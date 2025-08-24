import { DashBoardCard } from '@dashboard/components';
import { IcArrowRotateRight01 } from '@icons';
import { Button, ErrorSuspenseBoundary } from '@components';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { postTmapTransport } from '@dashboard/apis';

interface HelperDashboardSearchCardProps {
  destination: { lat: number; lon: number };
}

const subwayColors: Record<string, string> = {
  '1호선': 'bg-[#0052A4] text-white',
  '2호선': 'bg-[#00A84D] text-white',
  '3호선': 'bg-[#EF7C1C] text-white',
  '4호선': 'bg-[#00A5DE] text-white',
  '5호선': 'bg-[#996CAC] text-white',
  '6호선': 'bg-[#CD7C2F] text-white',
  '7호선': 'bg-[#747F00] text-white',
  '8호선': 'bg-[#E6186C] text-white',
  '9호선': 'bg-[#BDB092] text-white',
  신분당선: 'bg-[#D31145] text-white',
};

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
};

type TmapResponse = {
  metaData?: { plan?: { itineraries?: Array<{ totalTime?: number; legs?: TmapLeg[] }> } };
  plan?: { itineraries?: Array<{ totalTime?: number; legs?: TmapLeg[] }> };
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

  if (!legs.length) {
    return <div className='label1-12-medium text-text-neutral-secondary'>경로가 없어요</div>;
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
          {legs.map((leg: TmapLeg, idx: number) => {
            const mode = leg.mode ?? '';
            if (mode === 'WALK') {
              return (
                <li key={idx} className='text-text-neutral-secondary'>
                  <span className='mr-[0.6rem]'>🚶‍♂️</span>도보로 이동
                </li>
              );
            }
            if (mode === 'SUBWAY') {
              const line = (leg.laneName || leg.route || '').replace('(급행)', '').trim();
              const colorClass = subwayColors[line] || 'bg-neutral-20 text-text-neutral-primary';
              return (
                <li key={idx} className='text-text-neutral-primary'>
                  <span
                    className={`mr-[0.6rem] inline-block rounded-[0.4rem] px-[0.6rem] py-[0.2rem] ${colorClass}`}>
                    {line || '지하철'}
                  </span>
                  {leg.start?.name ?? ''} 승차 → {leg.end?.name ?? ''} 하차
                </li>
              );
            }
            if (mode === 'BUS') {
              const busNo = leg.route || '버스';
              return (
                <li key={idx} className='text-text-neutral-primary'>
                  <span className='mr-[0.6rem] inline-block rounded-[0.4rem] bg-[#1DA1F2] px-[0.6rem] py-[0.2rem] text-white'>
                    {busNo}
                  </span>
                  {leg.start?.name ?? ''} 승차 → {leg.end?.name ?? ''} 하차
                </li>
              );
            }
            return (
              <li key={idx} className='text-text-neutral-secondary'>
                기타 이동
              </li>
            );
          })}
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
