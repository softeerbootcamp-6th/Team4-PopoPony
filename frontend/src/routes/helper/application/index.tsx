import { RegionBottomSheet } from '@helper/components';
import { IcChevronDown } from '@icons';
import { PageLayout } from '@layouts';
import { z } from 'zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { EscortCard } from '@components';
import { getSearchRecruits } from '@helper/apis';
import { timeFormat } from '@utils';
import { useEffect, useState } from 'react';

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
  onClick: () => void;
}

const FilterButton = ({ label, onClick }: FilterButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex-center bg-neutral-10 w-fit gap-[0.4rem] rounded-full px-[1.2rem] py-[0.4rem]'>
      <span className='body1-16-bold text-text-neutral-primary'>{label}</span>
      <IcChevronDown />
    </button>
  );
};

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const [selectedRegion, setSelectedRegion] = useState<string>();
  const [selectedStartDate, setSelectedStartDate] = useState<string>();
  const [selectedEndDate, setSelectedEndDate] = useState<string>();

  const { data } = getSearchRecruits({
    region: selectedRegion,
    startDate: selectedStartDate,
    endDate: selectedEndDate,
  });
  const { inProgressMap: searchData } = data.data;
  const dateList = Object.keys(searchData);

  const handleSelectRegion = (value: string) => {
    setSelectedRegion(value);
  };

  return (
    <PageLayout>
      <PageLayout.Header title='일감 찾기' showBack={true} />
      <PageLayout.Content>
        <section className='flex-start gap-[1.2rem] px-[2rem] py-[1.2rem]'>
          <RegionBottomSheet onSelect={handleSelectRegion}>
            <FilterButton label='지역' onClick={() => {}} />
          </RegionBottomSheet>
          <FilterButton label='날짜' onClick={() => {}} />
        </section>
        <section className='flex flex-col gap-[1.6rem] p-[2rem]'>
          {dateList.map((date) => (
            <div className='flex flex-col gap-[0.8rem]' key={date}>
              <span key={date} className='body2-14-medium text-text-neutral-secondary'>
                {date}
              </span>
              {searchData[date].map((escort) => {
                return (
                  <EscortCard key={escort.recruitId} onClick={() => {}}>
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
        <div></div>
      </PageLayout.Content>
    </PageLayout>
  );
}
