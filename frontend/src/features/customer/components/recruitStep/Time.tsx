import { memo, useEffect } from 'react';
import { FormInput, Button, LabeledSection } from '@components';
import { FormLayout } from '@layouts';
import { z } from 'zod';
import { useFormValidation } from '@customer/hooks';
import type { RecruitStepProps } from '@customer/types';
import { IcAlertCircle } from '@icons';
import { useFormContext } from 'react-hook-form';

const dateSchema = z.object({
  escortDate: z
    .string()
    .min(1, { message: '날짜를 선택해주세요' })
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const selectedDate = new Date(date);
        return selectedDate > today;
      },
      { message: '오늘 이후의 날짜를 선택해주세요' }
    ),
});

const timeSchema = z
  .object({
    escortStartTime: z.string().min(1, { message: '시작 시간을 선택해주세요' }),
    escortEndTime: z.string().min(1, { message: '종료 시간을 선택해주세요' }),
    escortDuration: z.number(),
  })
  .refine(
    (data) => {
      const startTime = new Date(`2000-01-01T${data.escortStartTime}`);
      const endTime = new Date(`2000-01-01T${data.escortEndTime}`);
      return startTime < endTime;
    },
    {
      message: '시작 시간이 종료 시간보다 늦습니다.',
      path: ['escortEndTime'],
    }
  )
  .refine(
    (data) => {
      const startTime = new Date(`2000-01-01T${data.escortStartTime}`);
      const endTime = new Date(`2000-01-01T${data.escortEndTime}`);
      const diffInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      return diffInMinutes >= 120;
    },
    {
      message: '최소 2시간 이상 예약해주세요',
      path: ['escortDuration'],
    }
  );

const Time = memo(({ handleNextStep, handleBackStep }: RecruitStepProps) => {
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

  // 시간 계산 및 escortDuration 자동 설정
  useEffect(() => {
    if (timeValues.escortStartTime && timeValues.escortEndTime) {
      const startTime = new Date(`2000-01-01T${timeValues.escortStartTime}`);
      const endTime = new Date(`2000-01-01T${timeValues.escortEndTime}`);

      const diffInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      console.log('diffInMinutes', diffInMinutes);
      setValue('escortDuration', diffInMinutes);
      timeMarkFieldAsTouched('escortDuration');
    }
    console.log('fieldErrors', timeFieldErrors);
  }, [timeValues.escortStartTime, timeValues.escortEndTime, setValue]);

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
        <div className='flex gap-4'>
          <LabeledSection
            label='시작 시간'
            isChecked={!timeFieldErrors.escortStartTime && !!timeValues.escortStartTime}>
            <FormInput
              type='time'
              size='M'
              name='escortStartTime'
              placeholder='시작 시간 선택'
              validation={() => timeMarkFieldAsTouched('escortStartTime')}
            />
          </LabeledSection>
          <LabeledSection
            label='종료 시간'
            isChecked={!timeFieldErrors.escortEndTime && !!timeValues.escortEndTime}>
            <FormInput
              type='time'
              size='M'
              name='escortEndTime'
              placeholder='종료 시간 선택'
              validation={() => timeMarkFieldAsTouched('escortEndTime')}
            />
          </LabeledSection>
        </div>
        <div className='flex-between'>
          <div className='flex-center gap-1'>
            <IcAlertCircle
              className={`${
                timeFieldErrors.escortDuration || timeFieldErrors.escortEndTime
                  ? '[&_path]:fill-text-red-primary'
                  : '[&_path]:fill-icon-neutral-secondary'
              }`}
            />
            <span
              className={`body1-16-medium ${
                timeFieldErrors.escortDuration || timeFieldErrors.escortEndTime
                  ? 'text-text-red-primary'
                  : 'text-text-neutral-assistive'
              }`}>
              {timeFieldErrors.escortEndTime
                ? timeFieldErrors.escortEndTime
                : '최소 2시간 이상 예약해주세요'}
            </span>
          </div>
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterButtonWrapper>
          <div className='w-[10rem]'>
            <Button variant='secondary' onClick={handleBackStep}>
              이전
            </Button>
          </div>
          <Button
            className='flex-1'
            variant='primary'
            onClick={handleNextStep}
            disabled={!timeIsFormValid || !dateIsFormValid}>
            다음
          </Button>
        </FormLayout.FooterButtonWrapper>
      </FormLayout.Footer>
    </FormLayout>
  );
});

export default Time;
