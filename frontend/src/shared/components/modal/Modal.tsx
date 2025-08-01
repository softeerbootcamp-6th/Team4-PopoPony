import React, { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@components';
import type { ButtonProps } from '../Button';

// Main Modal Component
interface ModalProps {
  children: ReactNode;
  ref?: React.RefObject<HTMLDialogElement | null>;
}

const Modal = ({ children, ref }: ModalProps) => {
  const modalRoot = document.getElementById('modal');
  if (!modalRoot) return null;

  return createPortal(
    <dialog
      ref={ref}
      className='bg-background-default-white backdrop:bg-black-opacity-40 top-[50%] left-[50%] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.2rem] border-none focus:outline-none'
      onClick={() => {
        ref?.current?.close();
      }}>
      <div
        className='flex flex-col p-[2rem]'
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {children}
      </div>
    </dialog>,
    modalRoot
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

// Confirm Button (Primary)
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
