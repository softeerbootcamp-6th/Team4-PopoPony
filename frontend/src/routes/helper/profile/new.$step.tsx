import { useState, useEffect } from 'react';
import { Modal } from '@components';
import { PageLayout } from '@layouts';
import { type ProfileFormValues } from '@helper/types';
import { useFunnel, useModal } from '@hooks';
import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router';
import { Region, Detail } from '@helper/components';
import { FormProvider, useForm } from 'react-hook-form';
import { getHasProfile, getHelperById } from '@helper/apis';

export const Route = createFileRoute('/helper/profile/new/$step')({
  validateSearch: (search: { revise?: string } | undefined) => ({ revise: search?.revise }),
  component: RouteComponent,
});

const stepList = ['region', 'detail'];

function RouteComponent() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [enable, setEnable] = useState(false);
  const methods = useForm<ProfileFormValues>({ shouldUnregister: false });
  //이전에 프로필이 있는지, 그걸 수정하기 위해서 이 페이지에 라우팅 했는지 확인
  const { data: hasProfileData } = getHasProfile();
  //TODO: 만약 이걸 받아오는 api주소가 바뀌면 이걸 받아오는 부분도 바꿔야함
  const { data: helperData } = getHelperById(hasProfileData?.helperId, enable);
  const { revise } = useSearch({ from: '/helper/profile/new/$step' });
  useEffect(() => {
    if (revise === 'true') {
      setEnable(true);
    }
  }, [revise]);
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
      //현재 타입 에러 발생. 추후 백엔드와 협의 후 수정
      methods.setValue('region', helperData.data?.helperSimple?.area || '', {
        shouldDirty: true,
        shouldValidate: true,
      });
      methods.setValue('shortBio', helperData.data?.helperSimple?.shortBio || '', {
        shouldDirty: true,
        shouldValidate: true,
      });
      methods.setValue('strengthList', helperData.data?.helperSimple?.strengthList || [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      methods.setValue('certificateList', helperData.data?.helperSimple?.certificateList || [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [helperData, enable]);

  return (
    <PageLayout>
      <PageLayout.Header
        title='동행 신청하기'
        showBack={true}
        showClose={true}
        onClose={handleClose}
      />
      <PageLayout.Content>
        <div className='h-full flex-1 overflow-hidden'>
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
        </div>
      </PageLayout.Content>
      <Modal isOpen={isOpen} onClose={handleDenyClose}>
        <Modal.Title>프로필 작성을 중단하시겠어요?</Modal.Title>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={handleApproveClose}>네</Modal.ConfirmButton>
          <Modal.CloseButton onClick={handleDenyClose}>아니오</Modal.CloseButton>
        </Modal.ButtonContainer>
      </Modal>
    </PageLayout>
  );
}
