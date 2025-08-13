import { Button, FormInput, LabeledSection } from '@components';
import { FormLayout } from '@layouts';
import type { FunnelStepProps } from '@types';

const Time = ({ handleNextStep }: FunnelStepProps) => {
  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            <strong className='text-text-mint-on-primary'>총 2시간 56분</strong>
            <br />
            동행을 마무리하셨어요!
          </FormLayout.Title>
          <FormLayout.SubTitle>실제 진행 시간과 다르다면 수정해주세요.</FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <div className='flex gap-[1.2rem]'>
          <LabeledSection label='시작 시간' isChecked={true}>
            <FormInput
              type='time'
              size='M'
              name='estimatedMeetingTime'
              placeholder='시작 시간 선택'
              validation={() => {}}
            />
          </LabeledSection>
          <LabeledSection label='종료 시간' isChecked={true}>
            <FormInput
              type='time'
              size='M'
              name='estimatedReturnTime'
              placeholder='종료 시간 선택'
              validation={() => {}}
            />
          </LabeledSection>
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <Button onClick={handleNextStep} disabled={false}>
          네, 맞아요
        </Button>
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Time;
