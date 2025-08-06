import { Modal } from '@components';
import type { TermsModalProps } from '@types';

const TermsModal = ({ isOpen, onClose, terms }: TermsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='full'>
      <Modal.Title>{terms.title}</Modal.Title>
      <Modal.Content className='overflow-y-auto'>
        <div
          className='body1-16-medium text-text-neutral-primary overflow-y-auto leading-[1.89] tracking-[-0.02rem]'
          dangerouslySetInnerHTML={{ __html: terms.content }}
        />
      </Modal.Content>
      <Modal.ButtonContainer>
        <Modal.CloseButton onClick={onClose}>닫기</Modal.CloseButton>
      </Modal.ButtonContainer>
    </Modal>
  );
};

export default TermsModal;
