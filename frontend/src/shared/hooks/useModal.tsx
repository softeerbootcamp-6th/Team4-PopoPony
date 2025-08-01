import { useRef, useEffect, useState } from 'react';

const useModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // page-layout-container가 없으면 modal을 열 수 없도록 처리
  useEffect(() => {
    const container = document.getElementById('page-layout-container');
    if (!container) {
      console.warn('page-layout-container not found. Modal may not work properly.');
    }
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // 모달이 열려있을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      const container = document.getElementById('page-layout-container');
      if (container) {
        const originalOverflow = container.style.overflow;
        container.style.overflow = 'hidden';

        return () => {
          container.style.overflow = originalOverflow;
        };
      }
    }
  }, [isOpen]);

  return {
    modalRef,
    isOpen,
    openModal,
    closeModal,
  };
};

export default useModal;
