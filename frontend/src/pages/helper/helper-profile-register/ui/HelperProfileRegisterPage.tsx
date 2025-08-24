import { useEffect } from 'react';
import { Modal } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';
import { type ProfileFormValues } from '@helper/types';
import { toProfileFormValues } from '@helper/utils';
import { useFunnel, useModal } from '@shared/hooks';
import { useRouter } from '@tanstack/react-router';
import { getProfileExistance, getReviseHelperProfileInfo } from '@helper/apis';
import { Region, Detail } from '@helper/components';
import { FormProvider, useForm } from 'react-hook-form';

const stepList = ['region', 'detail'];

const HelperProfileRegisterPage = () => {
  const router = useRouter();
  const { data: hasProfileData } = getProfileExistance();
  const isRevise = hasProfileData?.data?.hasProfile || false;
  const { data: helperData } = getReviseHelperProfileInfo(
    hasProfileData?.data?.helperProfileId ?? 0,
    isRevise
  );

  const { isOpen, openModal, closeModal } = useModal();
  const methods = useForm<ProfileFormValues>({ shouldUnregister: false });
  const { reset } = methods;

  const { Funnel, Step, nextStep } = useFunnel({
    defaultStep: 'region',
    basePath: 'helper/profile/new',
    paramPath: '/helper/profile/new/$step',
    stepList: stepList,
  });

  const handleClose = () => {
    openModal();
  };

  const handleApproveClose = () => {
    closeModal();
    router.navigate({ to: '/helper' });
  };

  const handleDenyClose = () => {
    closeModal();
  };

  useEffect(() => {
    if (helperData) {
      const normalized = toProfileFormValues(helperData.data, hasProfileData?.data.helperProfileId);
      reset(normalized);
    }
  }, [helperData, reset]);

  return (
    <>
      <PageLayout.Header
        title='동행 신청하기'
        showBack={true}
        showClose={true}
        onClose={handleClose}
      />
      <PageLayout.Content>
        <FormProvider {...methods}>
          <Funnel>
            <Step name='region'>
              <Region handleNextStep={nextStep} />
            </Step>
            <Step name='detail'>
              <Detail />
            </Step>
          </Funnel>
        </FormProvider>
      </PageLayout.Content>
      <Modal isOpen={isOpen} onClose={handleDenyClose}>
        <Modal.Title>프로필 작성을 중단하시겠어요?</Modal.Title>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={handleApproveClose}>네</Modal.ConfirmButton>
          <Modal.CloseButton onClick={handleDenyClose}>아니오</Modal.CloseButton>
        </Modal.ButtonContainer>
      </Modal>
    </>
  );
};

export default HelperProfileRegisterPage;
