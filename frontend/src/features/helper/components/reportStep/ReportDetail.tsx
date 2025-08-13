import { FormTextarea } from '@components';
import { FormLayout } from '@layouts';
import type { FunnelStepProps } from '@types';
import { MultiImageSelect } from '@helper/components';

const ReportDetail = ({ handleNextStep }: FunnelStepProps) => {
  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>동행 보고서를 작성해주세요</FormLayout.Title>
          <FormLayout.SubTitle>
            보호자에게 전달할 상세한 내용을 작성하고 사진을 첨부해주세요.
          </FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <FormTextarea
          name='description'
          placeholder={`상세하게 내용을 입력해주세요.\nex. 병원 진료 내용 / 약국 복약지도 내용 / 진행 중 발생한 특이사항 등 `}
        />
        <MultiImageSelect
          name='imageCreateRequestList'
          prefix='uploads/report'
          maxImageLength={2}
        />
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={false} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default ReportDetail;
