import { useEffect, type RefObject } from 'react';

interface UseClickOutsideProps {
  ref: RefObject<HTMLElement | null>;
  handler: () => void;
  enabled?: boolean;
}

const useClickOutside = ({ ref, handler, enabled = true }: UseClickOutsideProps) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
};

export default useClickOutside;
