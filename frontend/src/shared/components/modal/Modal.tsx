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
  size?: 'full' | 'md';
}

const Modal = ({ children, isOpen = false, onClose, size = 'md' }: ModalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const containerElement = document.getElementById('page-layout-container');
    setContainer(containerElement);
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
      {size !== 'full' && (
        <div className='bg-black-opacity-40 absolute inset-0 z-40' onClick={handleBackdropClick} />
      )}

      {/* Modal Content - size='full'일 때 구조 개선 */}
      {size === 'full' ? (
        <div
          className='bg-background-default-white absolute inset-0 z-100 flex h-full max-h-[100dvh] w-full flex-col p-[2rem]'
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
    <div className='flex-shrink-0 pb-[0.8rem]'>
      <h2 className='title-20-bold text-neutral-primary'>{children}</h2>
    </div>
  );
};

// Content Component - flex-1과 min-height 추가
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

// Button Container Component
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

// Compound Component Export
Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.ButtonContainer = ModalButtonContainer;
Modal.Button = ModalButton;
Modal.ConfirmButton = ModalConfirmButton;
Modal.CloseButton = ModalCloseButton;

export default Modal;
