import { createFileRoute } from '@tanstack/react-router';
import { Button, ProgressBar, Modal, PhotoUpload, CheckboxCircle } from '@shared/ui';
import { useForm, FormProvider } from 'react-hook-form';
import type { HTMLAttributes } from 'react';
import { useModal } from '@shared/hooks';
import { useState } from 'react';

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
  // Modal hooks
  const {
    isOpen: isSingleModalOpen,
    openModal: openSingleModal,
    closeModal: closeSingleModal,
  } = useModal();
  const {
    isOpen: isDoubleModalOpen,
    openModal: openDoubleModal,
    closeModal: closeDoubleModal,
  } = useModal();
  const {
    isOpen: isConfirmModalOpen,
    openModal: openConfirmModal,
    closeModal: closeConfirmModal,
  } = useModal();

  // Checkbox states
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);
  const [checkbox3, setCheckbox3] = useState(false);

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
          <PhotoUpload name='photo' prefix='uploads/test' />
        </FormProvider>
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

      <Section title='CheckboxCircle'>
        <div className='flex flex-col gap-[1.6rem]'>
          <div className='flex items-center gap-[1.6rem]'>
            <CheckboxCircle checked={checkbox1} onChange={(e) => setCheckbox1(e.target.checked)} />
            <CheckboxCircle checked={checkbox2} onChange={(e) => setCheckbox2(e.target.checked)} />
            <CheckboxCircle checked={checkbox3} onChange={(e) => setCheckbox3(e.target.checked)} />
            <CheckboxCircle disabled />
            <CheckboxCircle checked disabled />
          </div>
        </div>
      </Section>
      {/* Modal components */}
      <Modal isOpen={isSingleModalOpen} onClose={closeSingleModal}>
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
      <Modal isOpen={isDoubleModalOpen} onClose={closeDoubleModal}>
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
      <Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal}>
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
