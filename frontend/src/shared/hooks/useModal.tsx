import { useEffect, useState } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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
      const body = document.body;
      if (body) {
        const originalOverflow = body.style.overflow;
        body.style.overflow = 'hidden';

        return () => {
          body.style.overflow = originalOverflow;
        };
      }
    }
  }, [isOpen]);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};

export default useModal;
