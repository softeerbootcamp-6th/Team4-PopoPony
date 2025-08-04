import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Button, Modal } from '@components';
import { useModal } from '@hooks';
import { IcPlusSideLeft } from '@icons';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <PageLayout>
      <PageLayout.Content>
        <div className='bg-neutral-10 relative h-full max-h-[22rem] px-[2rem] py-[1rem] pb-[2rem]'>
          <div className='absolute z-10'>
            <img src='/images/logo-text.svg' alt='logo-text' className='w-[4rem]' />
            <h2 className='headline-24-bold text-text-neutral-primary mt-[2.4rem] mb-[3rem]'>
              토닥과 함께 <br />
              안전하게 동행하세요!
            </h2>
            <Button variant='assistive' size='md' onClick={openModal}>
              <IcPlusSideLeft />
              <span className='text-text-neutral-primary'>새로운 동행 신청하기</span>
            </Button>
          </div>
          <img
            src='/images/home-graphic.png'
            alt='home'
            className='absolute top-[-4.4rem] right-0 w-[24.8rem]'
          />
        </div>
        <Modal isOpen={isOpen} onClose={closeModal}>
          <Modal.Title>알림</Modal.Title>
          <Modal.Content>
            정말로 삭제하시겠습니까?
            <br />
            삭제된 데이터는 복구할 수 없습니다.
          </Modal.Content>
          <Modal.ButtonContainer>
            <Modal.ConfirmButton onClick={closeModal}>확인</Modal.ConfirmButton>
          </Modal.ButtonContainer>
        </Modal>
      </PageLayout.Content>
    </PageLayout>
  );
}
