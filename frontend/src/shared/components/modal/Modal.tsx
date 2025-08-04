import { type ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@components';
import type { ButtonProps } from '../Button';

// Main Modal Component
interface ModalProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const Modal = ({ children, isOpen = false, onClose }: ModalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const containerElement = document.getElementById('page-layout-container');
    setContainer(containerElement);
  }, []);

  if (!container || !isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 클릭된 요소가 backdrop이라면
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div className='bg-black-opacity-40 absolute inset-0 z-40' onClick={handleBackdropClick} />

      {/* Modal Content */}
      <div className='pointer-events-none absolute inset-0 z-50 flex items-center justify-center'>
        <div
          className='pointer-events-auto relative w-[30rem] rounded-[1.2rem] bg-[var(--color-background-default-white)] p-[2rem] focus:outline-none'
          role='dialog'
          aria-modal='true'>
          {children}
        </div>
      </div>
    </>,
    container
  );
};

// Title Component
interface ModalTitleProps {
  children: ReactNode;
}

const ModalTitle = ({ children }: ModalTitleProps) => {
  return (
    <div className='pb-[0.8rem]'>
      <h2 className='title-20-bold text-neutral-primary'>{children}</h2>
    </div>
  );
};

// Content Component
interface ModalContentProps {
  children: ReactNode;
}

const ModalContent = ({ children }: ModalContentProps) => {
  return (
    <div>
      <div className='body1-16-medium text-text-neutral-secondary'>{children}</div>
    </div>
  );
};

// Button Container Component
interface ModalButtonContainerProps {
  children: ReactNode;
}

const ModalButtonContainer = ({ children }: ModalButtonContainerProps) => {
  return <div className='flex flex-col gap-[1rem] pt-[2.4rem]'>{children}</div>;
};

const ModalButton = ({ children, onClick, variant = 'primary', disabled = false }: ButtonProps) => {
  return (
    <Button variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
};

// 확인버튼 (Primary)
const ModalConfirmButton = ({ children, onClick, disabled }: ButtonProps) => {
  return (
    <ModalButton variant='primary' onClick={onClick} disabled={disabled}>
      {children}
    </ModalButton>
  );
};

// Close Button (Secondary)
const ModalCloseButton = ({ children, onClick, disabled }: ButtonProps) => {
  return (
    <ModalButton variant='secondary' onClick={onClick} disabled={disabled}>
      {children}
    </ModalButton>
  );
};

// Compound Component Export
Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.ButtonContainer = ModalButtonContainer;
Modal.Button = ModalButton;
Modal.ConfirmButton = ModalConfirmButton;
Modal.CloseButton = ModalCloseButton;

export default Modal;
