import { RegionBottomSheet } from '@helper/components';
import { IcChevronDown, IcCloseS } from '@icons';
import { PageLayout } from '@layouts';
import { z } from 'zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Calendar, EscortCard } from '@components';
import { getSearchRecruits } from '@helper/apis';
import { dateFormat, timeFormat } from '@utils';
import { useMemo, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useClickOutside } from '@hooks';
import { HelperEmptyCard } from '@customer/components';

const filterSearchSchema = z.object({
  region: z.string().optional(),
  date: z.string().optional(),
});

export const Route = createFileRoute('/helper/application/')({
  validateSearch: filterSearchSchema,
  component: RouteComponent,
});

interface FilterButtonProps {
  label: string;
  selected?: string | undefined;
  onClick: () => void;
  onClickReset?: () => void;
}

const FilterButton = ({ label, selected, onClick, onClickReset }: FilterButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex-center body1-16-bold bg-neutral-10 w-fit gap-[0.4rem] rounded-full px-[1.2rem] py-[0.4rem]'>
      {selected ? (
        <>
          <span className='text-text-mint-primary'>{selected}</span>
          <IcCloseS
            onClick={(e) => {
              e.stopPropagation();
              onClickReset?.();
            }}
          />
        </>
      ) : (
        <>
          <span className='text-text-neutral-primary'>{label}</span>
          <IcChevronDown />
        </>
      )}
    </button>
  );
};

const fmtDash = (d: Date) => dateFormat(d.toISOString(), 'yyyy-MM-dd');
const fmtDot = (d: Date) => dateFormat(d.toISOString(), 'yy.MM.dd');

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const [selectedRegion, setSelectedRegion] = useState<string>();

  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>();
  const calendarRef = useRef<HTMLDivElement>(null);

  const { startDate, endDate, formattedDateRange } = useMemo(() => {
    const from = selectedDateRange?.from;
    if (!from) return { startDate: undefined, endDate: undefined, formattedDateRange: undefined };

    const to = selectedDateRange?.to ?? from;

    const startDate = fmtDash(from);
    const endDate = fmtDash(to);

    const formattedDateRange =
      startDate === endDate ? fmtDot(from) : `${fmtDot(from)} ~ ${fmtDot(to)}`;

    return { startDate, endDate, formattedDateRange };
  }, [selectedDateRange]);

  const { data } = getSearchRecruits({
    region: selectedRegion,
    startDate,
    endDate,
  });
  const { inProgressMap: searchData } = data?.data ?? {};
  const dateList = Object.keys(searchData ?? {});

  const handleSelectRegion = (value: string) => {
    setSelectedRegion(value);
  };

  const handleClickReset = (name: 'region' | 'date') => {
    if (name === 'region') {
      setSelectedRegion(undefined);
    } else {
      setSelectedDateRange(undefined);
    }
  };

  const handleToggleCalendar = () => {
    setIsOpenCalendar((prev) => !prev);
  };

  // 캘린더 밖 영역 클릭 시 닫기
  useClickOutside({
    ref: calendarRef,
    handler: () => setIsOpenCalendar(false),
    enabled: isOpenCalendar,
  });

  return (
    <PageLayout>
      <PageLayout.Header title='일감 찾기' showBack={true} />
      <PageLayout.Content>
        <section className='flex-start gap-[1.2rem] px-[2rem] py-[1.2rem]'>
          <RegionBottomSheet onSelect={handleSelectRegion}>
            <FilterButton
              label='지역'
              selected={selectedRegion}
              onClick={() => {}}
              onClickReset={() => handleClickReset('region')}
            />
          </RegionBottomSheet>
          <div className='relative' ref={calendarRef}>
            <FilterButton
              label='날짜'
              selected={formattedDateRange}
              onClick={handleToggleCalendar}
              onClickReset={() => handleClickReset('date')}
            />
            {isOpenCalendar && (
              <div className='absolute top-[4rem] left-0 z-10 translate-x-[-30%]'>
                <Calendar
                  mode='range'
                  selected={selectedDateRange}
                  captionLayout='dropdown'
                  onSelect={(dateRange) => {
                    setSelectedDateRange(dateRange);
                  }}
                />
              </div>
            )}
          </div>
        </section>
        <section className='flex flex-col gap-[1.6rem] p-[2rem]'>
          {dateList.length === 0 && <HelperEmptyCard />}
          {dateList.map((date) => (
            <div className='flex flex-col gap-[0.8rem]' key={date}>
              <span key={date} className='body2-14-medium text-text-neutral-secondary'>
                {date}
              </span>
              {searchData?.[date]?.map((escort) => {
                return (
                  <EscortCard
                    key={escort.recruitId}
                    onClick={() => {
                      navigate({
                        to: '/helper/application/$escortId',
                        params: { escortId: escort.recruitId.toString() },
                      });
                    }}>
                    <EscortCard.StatusHeader
                      status={escort.recruitStatus}
                      text={`${escort.numberOfApplication}명이 현재 지원 중이에요!`}
                      title={`${date} ${escort.destination}`}
                    />
                    <EscortCard.Divider />
                    <EscortCard.InfoSection>
                      <EscortCard.Info
                        type='time'
                        text={`${date} ${timeFormat(escort.estimatedMeetingTime)} ~ ${timeFormat(escort.estimatedReturnTime)}`}
                      />
                      <EscortCard.Info
                        type='location'
                        text={`${escort.departureLocation} → ${escort.destination}`}
                      />
                    </EscortCard.InfoSection>
                  </EscortCard>
                );
              })}
            </div>
          ))}
        </section>
      </PageLayout.Content>
    </PageLayout>
  );
}
