import { memo, useEffect, useState } from 'react';
import { FormInput, LabeledSection } from '@components';
import { FormLayout } from '@layouts';
import { useFormValidation } from '@hooks';
import { timeSchema, dateSchema } from '@customer/types';
import { IcAlertCircle } from '@icons';
import { useFormContext } from 'react-hook-form';
import type { FunnelStepProps } from '@types';

const Time = memo(({ handleNextStep }: FunnelStepProps) => {
  const { setValue } = useFormContext();
  const {
    values: timeValues,
    fieldErrors: timeFieldErrors,
    isFormValid: timeIsFormValid,
    markFieldAsTouched: timeMarkFieldAsTouched,
  } = useFormValidation(timeSchema);
  const {
    values: dateValues,
    fieldErrors: dateFieldErrors,
    isFormValid: dateIsFormValid,
    markFieldAsTouched: dateMarkFieldAsTouched,
  } = useFormValidation(dateSchema);
  const [isTimeAndDateValid, setIsTimeAndDateValid] = useState(false);
  const [timeAndDateError, setTimeAndDateError] = useState<string>('');

  // 시간 계산 및 escortDuration 자동 설정
  useEffect(() => {
    if (timeValues.estimatedMeetingTime && timeValues.estimatedReturnTime) {
      const startTime = new Date(`2000-01-01T${timeValues.estimatedMeetingTime}`);
      const endTime = new Date(`2000-01-01T${timeValues.estimatedReturnTime}`);

      const diffInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      setValue('escortDuration', diffInMinutes);
      timeMarkFieldAsTouched('escortDuration');
    }
  }, [timeValues.estimatedMeetingTime, timeValues.estimatedReturnTime, setValue]);

  // 날짜와 시간 검증 (오늘 날짜 + 현재 시간 이후인지 확인)
  useEffect(() => {
    if (dateValues.escortDate && timeValues.estimatedMeetingTime) {
      const today = new Date();
      const selectedDate = new Date(dateValues.escortDate);
      const isToday = selectedDate.toDateString() === today.toDateString();

      if (isToday) {
        const meetingDateTime = new Date(
          `${dateValues.escortDate}T${timeValues.estimatedMeetingTime}`
        );
        const currentTime = new Date();

        if (meetingDateTime <= currentTime) {
          setIsTimeAndDateValid(false);
          setTimeAndDateError('현재보다 이후의 시간을 선택해주세요');
          return;
        }
      }

      setIsTimeAndDateValid(true);
      setTimeAndDateError('');
    } else {
      setIsTimeAndDateValid(false);
      setTimeAndDateError('');
    }
  }, [dateValues.escortDate, timeValues.estimatedMeetingTime]);

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>동행일과 시간을 선택해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>
        <LabeledSection
          label='동행일'
          isChecked={!dateFieldErrors.escortDate && !!dateValues.escortDate}
          message={dateFieldErrors.escortDate}>
          <FormInput
            type='date'
            size='M'
            name='escortDate'
            placeholder='날짜 선택'
            validation={() => dateMarkFieldAsTouched('escortDate')}
          />
        </LabeledSection>

        <LabeledSection
          label='동행시간'
          isChecked={
            !timeFieldErrors.estimatedMeetingTime &&
            !!timeValues.estimatedMeetingTime &&
            !timeFieldErrors.estimatedReturnTime &&
            !!timeValues.estimatedReturnTime
          }>
          <div className='flex gap-[1.2rem]'>
            <FormInput
              type='time'
              size='M'
              name='estimatedMeetingTime'
              placeholder='시작 시간 선택'
              validation={() => timeMarkFieldAsTouched('estimatedMeetingTime')}
            />

            <FormInput
              type='time'
              size='M'
              name='estimatedReturnTime'
              placeholder='종료 시간 선택'
              validation={() => timeMarkFieldAsTouched('estimatedReturnTime')}
            />
          </div>
        </LabeledSection>

        <div className='flex-between'>
          <div className='flex-center gap-[0.4rem]'>
            <IcAlertCircle
              className={`${
                timeFieldErrors.escortDuration ||
                timeFieldErrors.estimatedReturnTime ||
                timeAndDateError
                  ? '[&_path]:fill-text-red-primary'
                  : '[&_path]:fill-icon-neutral-secondary'
              }`}
            />
            <span
              className={`body1-16-medium ${
                timeFieldErrors.escortDuration ||
                timeFieldErrors.estimatedReturnTime ||
                timeAndDateError
                  ? 'text-text-red-primary'
                  : 'text-text-neutral-assistive'
              }`}>
              {timeAndDateError
                ? timeAndDateError
                : timeFieldErrors.estimatedReturnTime
                  ? timeFieldErrors.estimatedReturnTime
                  : '최소 2시간 이상 예약해주세요'}
            </span>
          </div>
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext
          handleClickNext={handleNextStep}
          disabled={!timeIsFormValid || !dateIsFormValid || !isTimeAndDateValid}
        />
      </FormLayout.Footer>
    </FormLayout>
  );
});

export default Time;
