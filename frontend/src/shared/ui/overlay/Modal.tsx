import { type ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@shared/ui';
import type { ButtonProps } from '../Button';

// Main Modal Component
interface ModalProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  size?: 'full' | 'md';
}

const Modal = ({ children, isOpen = false, onClose, size = 'md' }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const modalContent = (
    <div
      className='bg-black-opacity-40 fixed top-0 left-1/2 z-40 h-[100dvh] w-full max-w-[500px] min-w-[375px] -translate-x-1/2 min-[1200px]:left-auto min-[1200px]:ml-[calc(50dvw+7rem)] min-[1200px]:-translate-x-0'
      onClick={handleBackdropClick}>
      {size === 'full' ? (
        <div
          className='bg-background-default-white absolute inset-0 z-50 flex h-full max-h-[100dvh] w-full flex-col p-[2rem]'
          role='dialog'
          aria-modal='true'>
          {children}
        </div>
      ) : (
        <div
          className='pointer-events-none absolute inset-0 z-50 flex items-center justify-center'
          onClick={handleBackdropClick}>
          <div
            className='bg-background-default-white pointer-events-auto relative w-[30rem] rounded-[1.2rem] p-[2rem] focus:outline-none'
            role='dialog'
            aria-modal='true'
            onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Title Component
interface ModalTitleProps {
  children: ReactNode;
}

const ModalTitle = ({ children }: ModalTitleProps) => {
  return (
    <div className='flex-shrink-0 pb-[0.8rem]'>
      <h2 className='title-20-bold text-neutral-primary'>{children}</h2>
    </div>
  );
};

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

const ModalContent = ({ children, className = '' }: ModalContentProps) => {
  return (
    <div className={`body1-16-medium text-text-neutral-secondary min-h-0 flex-1 ${className}`}>
      {children}
    </div>
  );
};

interface ModalButtonContainerProps {
  children: ReactNode;
}

const ModalButtonContainer = ({ children }: ModalButtonContainerProps) => {
  return <div className='flex flex-shrink-0 flex-col gap-[1rem] pt-[2.4rem]'>{children}</div>;
};

const ModalButton = ({ children, onClick, variant = 'primary', disabled = false }: ButtonProps) => {
  return (
    <Button variant={variant} size='md' onClick={onClick} disabled={disabled}>
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

Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.ButtonContainer = ModalButtonContainer;
Modal.Button = ModalButton;
Modal.ConfirmButton = ModalConfirmButton;
Modal.CloseButton = ModalCloseButton;

export default Modal;
