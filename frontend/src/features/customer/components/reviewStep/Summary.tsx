import { type RecruitStepProps } from '@customer/types';
import { FormLayout } from '@layouts';
import { useFormValidation } from '@hooks';
import { summarySchema, satisfactionLevel } from '@customer/types';
import { useFormContext } from 'react-hook-form';

interface SummaryProps extends RecruitStepProps {
  name: string;
}

const Summary = ({ name, handleNextStep, handleBackStep }: SummaryProps) => {
  const { register } = useFormContext();
  const { values, fieldErrors, isFormValid, markFieldAsTouched } = useFormValidation(summarySchema);

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            <strong className='text-text-mint-primary'>{name}</strong>님과 함께한 <br /> 동행 과정은
            어떠셨나요?
          </FormLayout.Title>
        </FormLayout.TitleWrapper>
        {satisfactionLevel.map((level, index) => {
          return (
            <div key={index} className='w-full'>
              <input
                type='radio'
                id={`${level}-${index}`}
                value={level}
                className='peer hidden'
                {...register('satisfactionLevel')}
              />
              <label
                htmlFor={`${level}-${index}`}
                className='border-neutral-20 peer-checked:border-mint-60 peer-checked:bg-mint-5 peer-checked:text-mint-70 flex-center h-[4.8rem] w-full cursor-pointer rounded-[0.4rem] border'>
                {level}
              </label>
            </div>
          );
        })}
      </FormLayout.Content>
    </FormLayout>
  );
};

export default Summary;
