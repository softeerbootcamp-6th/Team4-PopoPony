import { IcChevronDown } from '@icons';
import { isBefore } from 'date-fns';

import { useFormContext, useWatch } from 'react-hook-form';

import { isBeforeToday } from '@shared/lib';
import type { FunnelStepProps } from '@shared/types';
import { Checkbox, DatePickerInput, LabeledSection } from '@shared/ui';
import { FormLayout } from '@shared/ui/layout';

const Reservation = ({ handleNextStep }: FunnelStepProps) => {
  const { register, setValue, control } = useFormContext();

  const hasNextAppointment = useWatch({ control, name: 'hasNextAppointment' });
  const reservationDate = useWatch({ control, name: 'reservationDate' });
  const reservationTime = useWatch({ control, name: 'reservationTime' });

  const nextReservationTime = new Date(`${reservationDate}T${reservationTime}`);

  const today = new Date();
  const isValidTime = reservationDate && reservationTime && isBefore(today, nextReservationTime);

  const isValidButton = !hasNextAppointment || (reservationDate && isValidTime);

  const getTimeErrorMessage = () => {
    if (!reservationDate || !reservationTime) {
      return undefined;
    }
    if (isBefore(nextReservationTime, today)) {
      return '예약 일정은 오늘 이후여야 합니다.';
    }
    return undefined;
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            다음 진료의
            <br />
            예약 일정을 알려주세요
          </FormLayout.Title>
          <FormLayout.SubTitle>
            <Checkbox
              label='다음 진료를 예약하지 않았어요'
              checked={!hasNextAppointment}
              onChange={() => {
                if (hasNextAppointment) {
                  setValue('reservationDate', undefined);
                  setValue('reservationTime', undefined);
                }
                setValue('hasNextAppointment', !hasNextAppointment);
              }}
            />
          </FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <LabeledSection label='예약 일정' isChecked={isValidTime} message={getTimeErrorMessage()}>
          <div className='flex-start gap-[1.2rem]'>
            <DatePickerInput
              name='reservationDate'
              disabledDate={isBeforeToday}
              disabled={!hasNextAppointment}
            />
            <div className='border-stroke-neutral-dark bg-background-default-white focus-within:border-neutral-80 relative flex h-[5.1rem] w-full items-center border-b transition-[color,box-shadow] focus-within:ring-0'>
              <div className='relative flex-1'>
                <input
                  type='time'
                  disabled={!hasNextAppointment}
                  className='body1-16-medium text-text-neutral-primary w-full bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0'
                  {...register('reservationTime', {
                    onChange: (e) => {
                      setValue('reservationTime', `${e.target.value}:00`);
                    },
                  })}
                />
                {!reservationTime && (
                  <div className='body1-16-medium bg-background-default-white text-text-neutral-assistive pointer-events-none absolute top-0 left-0 w-full'>
                    {hasNextAppointment ? '시간 선택' : '-'}
                  </div>
                )}
              </div>
              <IcChevronDown className='[&_path]:fill-icon-neutral-secondary pointer-events-none h-[2.4rem] w-[2.4rem] transition-transform duration-200' />
            </div>
          </div>
        </LabeledSection>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={!isValidButton} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Reservation;
