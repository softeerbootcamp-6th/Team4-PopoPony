import { FormLayout } from '@layouts';
import type { FunnelStepProps } from '@types';
import { MultiImageSelect } from '@helper/components';
import { useFormContext, useWatch } from 'react-hook-form';
import { cn } from '@/shared/libs/utils';

const ReportDetail = ({ handleNextStep }: FunnelStepProps) => {
  const { register, control } = useFormContext();

  const description = useWatch({
    control,
    name: 'description',
  });

  const isValid = description && description.length >= 5;

  const getErrorMessage = () => {
    if (description && description.length < 5) {
      return '동행 보고서는 5글자 이상 작성해주세요.';
    }
    return '';
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>동행 보고서를 작성해주세요</FormLayout.Title>
          <FormLayout.SubTitle>
            보호자에게 전달할 상세한 내용을 작성하고 사진을 첨부해주세요.
          </FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <div>
          <textarea
            placeholder={`상세하게 내용을 입력해주세요.\nex. 병원 진료 내용 / 약국 복약지도 내용 / 진행 중 발생한 특이사항 등 `}
            className={cn(
              'border-stroke-neutral-dark bg-background-default-white body1-16-medium placeholder:text-text-neutral-assistive focus:border-neutral-80 min-h-[14rem] w-full resize-none rounded-[0.6rem] border px-[1.2rem] py-[1rem] break-keep transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50'
            )}
            {...register('description')}
          />
          {getErrorMessage() && (
            <p className='text-text-red-primary body2-14-medium'>{getErrorMessage()}</p>
          )}
        </div>

        <MultiImageSelect
          name='imageCreateRequestList'
          prefix='uploads/report'
          maxImageLength={2}
        />
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={!isValid} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default ReportDetail;
