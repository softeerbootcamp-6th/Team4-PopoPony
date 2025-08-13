import { type RecruitStepProps, detailOption } from '@customer/types';
import { FormLayout } from '@layouts';
import { useFormValidation } from '@hooks';
import { MultiOptionSelector, Checkbox } from '@components';
import { detailSchema } from '@customer/types';
import { useFormContext } from 'react-hook-form';

interface DetailProps extends RecruitStepProps {
  name: string;
}

const Detail = ({ name, handleNextStep }: DetailProps) => {
  const { setValue } = useFormContext();
  const { values, isFormValid } = useFormValidation(detailSchema);

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            <strong className='text-text-mint-primary'>{name}</strong>님의 좋은 점이 있었다면 <br />{' '}
            알려주세요
          </FormLayout.Title>
          <FormLayout.SubTitle>최대 3개까지 선택할 수 있어요.</FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <MultiOptionSelector
          name='detailComment'
          options={detailOption}
          showHelperText={false}
          dataFormat='string'
          max={3}
        />
        <Checkbox
          label='장점이 없었어요'
          checked={values.detailComment && values.detailComment.length === 0}
          onChange={() => setValue('detailComment', [])}
        />
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext
          handleClickNext={handleNextStep as () => void}
          disabled={!isFormValid}
        />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Detail;
