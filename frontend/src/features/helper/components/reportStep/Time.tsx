import { IcChevronDown } from '@icons';

import { useFormContext } from 'react-hook-form';

import { isTimeBefore, timeDuration } from '@shared/lib';
import type { FunnelStepProps } from '@shared/types';
import { Button, LabeledSection } from '@shared/ui';
import { FormLayout } from '@shared/ui/layout';

const Time = ({ handleNextStep }: FunnelStepProps) => {
  const { register, watch } = useFormContext();

  const actualMeetingTime = watch('actualMeetingTime');
  const actualReturnTime = watch('actualReturnTime');

  const isValidTime =
    actualMeetingTime && actualReturnTime && isTimeBefore(actualMeetingTime, actualReturnTime);

  const getTimeErrorMessage = () => {
    if (!actualMeetingTime || !actualReturnTime) {
      return undefined;
    }
    if (actualMeetingTime >= actualReturnTime) {
      return '시작 시간은 종료 시간보다 빨라야 합니다.';
    }
    return undefined;
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            <strong className='text-text-mint-on-primary'>
              총 {timeDuration(actualMeetingTime ?? '00:00', actualReturnTime ?? '00:00')}
            </strong>
            <br />
            동행을 마무리하셨어요!
          </FormLayout.Title>
          <FormLayout.SubTitle>실제 진행 시간과 다르다면 수정해주세요.</FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <div className='flex gap-[1.2rem]'>
          <LabeledSection label='동행 시간' isChecked={isValidTime} message={getTimeErrorMessage()}>
            <div className='flex-start gap-[1.2rem]'>
              <div className='border-stroke-neutral-dark bg-background-default-white focus-within:border-neutral-80 relative flex h-[5.1rem] w-full items-center border-b transition-[color,box-shadow] focus-within:ring-0'>
                <div className='relative flex-1'>
                  <input
                    type='time'
                    className='body1-16-medium text-text-neutral-primary w-full bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0'
                    {...register('actualMeetingTime')}
                  />
                  {!actualMeetingTime && (
                    <div className='body1-16-medium bg-background-default-white text-text-neutral-assistive pointer-events-none absolute top-0 left-0 w-full'>
                      {'시작 시간 선택'}
                    </div>
                  )}
                </div>
                <IcChevronDown className='[&_path]:fill-icon-neutral-secondary pointer-events-none h-[2.4rem] w-[2.4rem] transition-transform duration-200' />
              </div>
              <div className='border-stroke-neutral-dark bg-background-default-white focus-within:border-neutral-80 relative flex h-[5.1rem] w-full items-center border-b transition-[color,box-shadow] focus-within:ring-0'>
                <div className='relative flex-1'>
                  <input
                    type='time'
                    className='body1-16-medium text-text-neutral-primary w-full bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0'
                    {...register('actualReturnTime')}
                  />
                  {!actualReturnTime && (
                    <div className='body1-16-medium bg-background-default-white text-text-neutral-assistive pointer-events-none absolute top-0 left-0 w-full'>
                      {'종료 시간 선택'}
                    </div>
                  )}
                </div>
                <IcChevronDown className='[&_path]:fill-icon-neutral-secondary pointer-events-none h-[2.4rem] w-[2.4rem] transition-transform duration-200' />
              </div>
            </div>
          </LabeledSection>
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <Button onClick={handleNextStep} disabled={!isValidTime}>
          네, 맞아요
        </Button>
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Time;
