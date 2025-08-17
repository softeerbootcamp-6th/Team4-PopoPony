import { DetailFormSchema, CERTIFICATE_OPTIONS, STRENGTH_OPTIONS } from '@helper/types';
import type { ResponseVoid } from '@types';
import { useFormValidation } from '@hooks';
import { FormLayout } from '@layouts';
import { useNavigate } from '@tanstack/react-router';
import {
  LabeledSection,
  FormInput,
  MultiOptionSelector,
  Divider,
  MultiOptionSelectorCol,
  Button,
} from '@components';
import { CertificateImageUploader } from '@helper/components';
import {
  IcWheelchair,
  IcWheelchairDisabled,
  IcRecognize,
  IcRecognizeDisabled,
  IcShoes,
  IcShoesDisabled,
} from '@icons';
import { postHelperProfile } from '@helper/apis';
import { useFormContext } from 'react-hook-form';

const Detail = () => {
  const navigate = useNavigate();
  const { getValues } = useFormContext();
  const { values, fieldErrors, isFormValid, markFieldAsTouched } =
    useFormValidation(DetailFormSchema);

  const { mutate } = postHelperProfile();
  const mappingIcons = {
    '안전한 부축으로 편안한 이동': <IcShoes />,
    '휠체어 이용도 전문적인 동행': <IcWheelchair />,
    '인지 장애 어르신 맞춤 케어': <IcRecognize />,
  };
  const mappingIconsDisabled = {
    '안전한 부축으로 편안한 이동': <IcShoesDisabled />,
    '휠체어 이용도 전문적인 동행': <IcWheelchairDisabled />,
    '인지 장애 어르신 맞춤 케어': <IcRecognizeDisabled />,
  };
  const strengthList = STRENGTH_OPTIONS.map((option) => ({
    label: option,
    value: option,
    icon: mappingIcons[option],
    iconDisabled: mappingIconsDisabled[option],
  }));

  const handleSubmit = () => {
    mutate(
      {
        body: {
          profileImageCreateRequest: getValues('profileImageCreateRequest'),
          certificateInfoList: getValues('certificateList'),
          strengthList: getValues('strengthList'),
          shortBio: getValues('shortBio'),
          area: getValues('region'),
        },
      },
      {
        onSuccess: (response: ResponseVoid) => {
          if (response.status !== 200) {
            alert(response.message ?? '도우미 등록에 실패했습니다. 다시 시도해주세요.');
            return;
          }
          navigate({ to: '/helper/profile/new/completed' });
        },
        onError: () => {
          alert('도우미 등록에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>도우미의 상세 정보를 입력해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>
        <LabeledSection
          label='한 줄 소개'
          isChecked={!fieldErrors.shortBio && !!values.shortBio}
          message={fieldErrors.shortBio}>
          <FormInput
            type='text'
            name='shortBio'
            validation={() => markFieldAsTouched('shortBio')}
            placeholder='한 줄 소개를 입력해주세요'
          />
        </LabeledSection>
        <LabeledSection
          label='자격 사항'
          isChecked={
            !fieldErrors.certificateList &&
            values.certificateList &&
            values.certificateList.length > 0
          }
          message={fieldErrors.certificateList}>
          <MultiOptionSelector
            name='certificateList'
            options={CERTIFICATE_OPTIONS}
            dataFormat='object'
          />
        </LabeledSection>
        <Divider />
        {values.certificateList && values.certificateList.length > 0 && (
          <CertificateImageUploader
            selectedCertificates={values.certificateList}
            prefix='uploads/certificate'
          />
        )}
        <LabeledSection
          label='나만의 강점'
          isChecked={
            !fieldErrors.strengthList &&
            Array.isArray(values.strengthList) &&
            values.strengthList.length > 0
          }
          message={fieldErrors.strengthList}>
          <MultiOptionSelectorCol name='strengthList' options={strengthList} />
        </LabeledSection>
      </FormLayout.Content>
      <FormLayout.Footer>
        <Button variant='primary' size='lg' onClick={handleSubmit} disabled={!isFormValid}>
          완료
        </Button>
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Detail;
