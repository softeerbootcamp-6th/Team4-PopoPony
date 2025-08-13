import { Checkbox, FormInput } from '@components';
import { FormLayout } from '@layouts';
import type { FunnelStepProps } from '@types';

const Reservation = ({ handleNextStep }: FunnelStepProps) => {
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
            <Checkbox label='다음 진료를 예약하지 않았어요' checked={false} />
          </FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <div className='flex gap-[1.2rem]'>
          <FormInput
            type='date'
            size='M'
            name='escortDate'
            placeholder='날짜 선택'
            validation={() => {}}
          />
          <FormInput
            type='time'
            size='M'
            name='estimatedReturnTime'
            placeholder='종료 시간 선택'
            validation={() => {}}
          />
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={false} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Reservation;
