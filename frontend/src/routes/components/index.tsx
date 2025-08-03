import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  LabeledSection,
  TwoOptionSelector,
  FormInput,
  ProgressBar,
  Modal,
  BottomSheet,
  PhotoUpload,
} from '@components';
import { useForm, FormProvider, type SubmitHandler, useWatch, Controller } from 'react-hook-form';
import type { HTMLAttributes } from 'react';
import { useModal } from '@hooks';

export const Route = createFileRoute('/components/')({
  component: RouteComponent,
});

type FormValues = {
  name: string;
  quantity: string;
  price: string;
  birthDate: string;
  time: string;
  phone: string;
};

function RouteComponent() {
  const methods = useForm<FormValues>();
  const watchAllFields = methods.watch();
  console.log(watchAllFields);
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Final Data:', data);
  };
  // Modal hooks
  const {
    modalRef: singleModalRef,
    isOpen: isSingleModalOpen,
    openModal: openSingleModal,
    closeModal: closeSingleModal,
  } = useModal();
  const {
    modalRef: doubleModalRef,
    isOpen: isDoubleModalOpen,
    openModal: openDoubleModal,
    closeModal: closeDoubleModal,
  } = useModal();
  const {
    modalRef: confirmModalRef,
    isOpen: isConfirmModalOpen,
    openModal: openConfirmModal,
    closeModal: closeConfirmModal,
  } = useModal();

  interface SectionProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
  }

  const Section = ({ title, children, className }: SectionProps) => {
    return (
      <div className={`flex w-[33.5rem] flex-col gap-[1.6rem] ${className}`}>
        <h3 className='text-neutral-90 title-20-bold mb-[1.6rem]'>{title}</h3>
        {children}
      </div>
    );
  };

  return (
    <div className='bg-background-default-white absolute inset-0 flex h-fit flex-wrap gap-[4rem] p-[4rem]'>
      <Section title='Button'>
        <div className='flex flex-col gap-[1.6rem]'>
          <Button variant='primary' size='sm'>
            primary sm
          </Button>
          <Button variant='primary' size='md'>
            primary md
          </Button>
          <Button variant='primary' size='lg'>
            primary lg
          </Button>
          <Button variant='secondary' size='sm'>
            secondary sm
          </Button>
          <Button variant='secondary' size='md'>
            secondary md
          </Button>
          <Button variant='secondary' size='lg'>
            secondary lg
          </Button>
          <Button variant='assistive' size='sm'>
            assistive sm
          </Button>
          <Button variant='assistive' size='md'>
            assistive md
          </Button>
          <Button variant='assistive' size='lg'>
            assistive lg
          </Button>
          <Button variant='primary' size='sm' isLoading>
            primary sm
          </Button>
          <Button variant='secondary' size='md' isLoading>
            secondary md
          </Button>
          <Button variant='secondary' size='lg' isLoading>
            secondary lg
          </Button>
        </div>
      </Section>

      <Section title='LabeledSection/TwoOptionSelector'>
        <FormProvider {...methods}>
          <PhotoUpload name='photo' />
        </FormProvider>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <input defaultValue='name' {...methods.register('name')} />

          {/* include validation with required or other standard HTML validation rules */}
          <input {...methods.register('price', { required: true })} />
          {/* errors will return when field validation fails  */}
          {methods.formState.errors.price && <span>This field is required</span>}

          <input type='submit' />
        </form>
      </Section>

      <Section title='ProgressBar'>
        <ProgressBar maxStep={3} currentStep={1} />
        <ProgressBar maxStep={3} currentStep={2} />
        <ProgressBar maxStep={3} currentStep={3} />
        <ProgressBar maxStep={4} currentStep={1} />
      </Section>

      <Section title='Modal은 작동 안해요!! PageLayout 안에 있어야 해요!!'>
        <div className='flex flex-col gap-[1.6rem]'>
          <Button variant='primary' size='md' onClick={openSingleModal}>
            단일 버튼 모달
          </Button>
          <Button variant='secondary' size='md' onClick={openDoubleModal}>
            이중 버튼 모달
          </Button>
          <Button variant='assistive' size='md' onClick={openConfirmModal}>
            확인 모달
          </Button>
        </div>
      </Section>
      {/* Modal components */}
      <Modal ref={singleModalRef} isOpen={isSingleModalOpen} onClose={closeSingleModal}>
        <Modal.Title>알림</Modal.Title>
        <Modal.Content>
          정말로 삭제하시겠습니까?
          <br />
          삭제된 데이터는 복구할 수 없습니다.
        </Modal.Content>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={closeSingleModal}>확인</Modal.ConfirmButton>
        </Modal.ButtonContainer>
      </Modal>
      {/* 이중 버튼 모달 */}
      <Modal ref={doubleModalRef} isOpen={isDoubleModalOpen} onClose={closeDoubleModal}>
        <Modal.Title>동행 신청 완료</Modal.Title>
        <Modal.Content>
          동행 신청이 성공적으로 완료되었습니다.
          <br />
          신청 내역은 마이페이지에서 확인하실 수 있습니다.
        </Modal.Content>
        <Modal.ButtonContainer>
          <Modal.CloseButton onClick={closeDoubleModal}>취소</Modal.CloseButton>
          <Modal.ConfirmButton
            onClick={() => {
              alert('확인 버튼 클릭됨!');
              closeDoubleModal();
            }}>
            확인
          </Modal.ConfirmButton>
        </Modal.ButtonContainer>
      </Modal>
      {/* 확인 모달 */}
      <Modal ref={confirmModalRef} isOpen={isConfirmModalOpen} onClose={closeConfirmModal}>
        <Modal.Title>주의사항</Modal.Title>
        <Modal.Content>
          동행 서비스를 이용하기 전에 다음 사항을 확인해주세요:
          <br />
          <br />
          • 환자의 건강 상태가 안정적인지 확인
          <br />
          • 필요한 의료용품을 준비
          <br />• 병원 예약 시간을 확인
        </Modal.Content>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={closeConfirmModal}>이해했습니다</Modal.ConfirmButton>
        </Modal.ButtonContainer>
      </Modal>
    </div>
  );
}
