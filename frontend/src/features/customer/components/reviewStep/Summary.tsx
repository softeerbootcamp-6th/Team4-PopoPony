import { type RecruitStepProps } from '@customer/types';
import { FormLayout } from '@shared/ui/layout';
import { useFormValidation } from '@shared/hooks';
import { Button, FormTextarea } from '@shared/ui';
import { summarySchema, satisfactionLevel } from '@customer/types';
import { useFormContext } from 'react-hook-form';
import { Fragment } from 'react';

interface SummaryProps extends RecruitStepProps {
  name: string;
}

const Summary = ({ name, handleNextStep }: SummaryProps) => {
  const { register, setValue } = useFormContext();
  const { values, isFormValid } = useFormValidation(summarySchema);
  const satisfactionIcon = {
    [satisfactionLevel[0]]: { label: 'good', text: '특별히 불편했던 점이 없었어요' },
    [satisfactionLevel[1]]: { label: 'average', text: '나쁘지는 않았지만 조금 아쉬웠어요' },
    [satisfactionLevel[2]]: { label: 'bad', text: '불편했던 점이 있었어요' },
  };
  const handleOptionClick = (level: (typeof satisfactionLevel)[number]) => () => {
    if (values.satisfactionLevel === level) {
      return;
    } else {
      setValue('satisfactionLevel', level);
      setValue('satisfactionComment', '');
    }
  };
  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            <strong className='text-text-mint-primary'>{name}</strong>님과 함께한 <br /> 동행 과정은
            어떠셨나요?
          </FormLayout.Title>
        </FormLayout.TitleWrapper>
        <div className='flex flex-col gap-[1.2rem]'>
          {satisfactionLevel.map((level, index) => {
            return (
              <Fragment key={level}>
                <div className='w-full'>
                  <input
                    type='radio'
                    id={`${level}-${index}`}
                    value={level}
                    className='peer hidden'
                    {...register('satisfactionLevel')}
                    checked={values.satisfactionLevel === level}
                  />
                  <label
                    htmlFor={`${level}-${index}`}
                    onClick={handleOptionClick(level)}
                    className='border-stroke-neutral-dark flex-start peer-checked:border-mint-60 peer-checked:bg-mint-5 peer-checked:text-mint-70 flex-center h-[8rem] w-full cursor-pointer gap-[1.2rem] rounded-[0.8rem] border p-[1.6rem]'>
                    <img
                      className='h-[4.8rem] w-[4.8rem]'
                      src={`/images/status-${satisfactionIcon[level].label}.svg`}
                      alt={level}
                    />
                    <div className='flex flex-col gap-[0.4rem]'>
                      <div className='label1-16-bold text-neutral-90'>{level}</div>
                      <div className='label1-16-medium text-neutral-60'>
                        {satisfactionIcon[level].text}
                      </div>
                    </div>
                  </label>
                </div>
                {values.satisfactionLevel === level && values.satisfactionLevel !== '좋았어요' && (
                  <FormTextarea
                    name='satisfactionComment'
                    placeholder='불편했던 점을 구체적으로 적어주세요.(10자 이상)'
                    rows={5}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <Button variant='primary' onClick={handleNextStep} disabled={!isFormValid}>
          다음
        </Button>
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Summary;
