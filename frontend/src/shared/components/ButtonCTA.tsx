import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@components';
import type { ButtonHTMLAttributes } from 'react';
import { useRouter } from '@tanstack/react-router';
import { IcChevronDoubleLeft } from '@icons';

export interface ButtonCTAProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant: 'single' | 'double' | 'slide';
  text: string;
  className?: string;
}

const ButtonCTA = ({ variant, text, className = '', ...props }: ButtonCTAProps) => {
  const renderContent = () => {
    switch (variant) {
      case 'single':
        return <SingleButton text={text} {...props} />;
      case 'double':
        return <DoubleButton leftText='이전' rightText={text} {...props} />;
      case 'slide':
        return <SlideButton text={text} {...props} />;
      default:
        return <SingleButton text={text} {...props} />;
    }
  };

  return (
    <div className={`bg-white px-[2rem] pt-[1.2rem] pb-[1.6rem] ${className}`}>
      {renderContent()}
    </div>
  );
};

const SingleButton = ({
  text,
  ...props
}: { text: string } & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button variant='primary' {...props}>
      {text}
    </Button>
  );
};

const DoubleButton = ({
  leftText,
  rightText,
  ...props
}: {
  leftText?: string;
  rightText?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const router = useRouter();
  const handleClick = () => {
    router.history.back();
  };

  return (
    <div className='flex gap-[1.2rem]'>
      <div className='flex-1'>
        <Button variant='secondary' onClick={handleClick}>
          {leftText}
        </Button>
      </div>

      <div className='flex-3'>
        <Button variant='primary' {...props}>
          {rightText}
        </Button>
      </div>
    </div>
  );
};

const SlideButton = ({
  text,
  onClick,
  disabled,
}: { text: string } & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'disabled'>) => {
  const [slideProgress, setSlideProgress] = useState(0); // 0-100 percentage
  const [isDragging, setIsDragging] = useState(false);
  //   const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPositionRef = useRef<number>(0);

  const handleStart = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    startPositionRef.current = clientX - containerRect.left;
    setIsDragging(true);
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const currentX = clientX - containerRect.left;
      const deltaX = currentX - startPositionRef.current;
      const maxWidth = containerRect.width - 56; // 5.6rem = 56px

      const progress = Math.max(0, Math.min((deltaX / maxWidth) * 100, 100));
      setSlideProgress(progress);

      //   // 80% 이상 슬라이드하면 완료 상태로 변경
      //   if (progress >= 80) {
      //     setIsCompleted(true);
      //   } else {
      //     setIsCompleted(false);
      //   }
    },
    [isDragging]
  );

  const handleEnd = useCallback(() => {
    if (slideProgress >= 80) {
      // 완료 - 100%로 설정하고 콜백 실행
      setSlideProgress(100);
      //   setIsCompleted(true);
      setTimeout(() => {
        onClick?.(new MouseEvent('click') as unknown as React.MouseEvent<HTMLButtonElement>);
      }, 200);
    } else {
      // 복귀
      setSlideProgress(0);
      //   setIsCompleted(false);
    }
    setIsDragging(false);
  }, [slideProgress, onClick]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      className={`relative h-[5.6rem] w-full overflow-hidden rounded-[1.2rem] ${
        disabled ? 'pointer-events-none opacity-50' : 'cursor-grab select-none'
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}>
      {/* Bottom Layer - Completed State (Dark Green) */}
      <div className='absolute inset-0 flex items-center justify-center rounded-[1.2rem] bg-[#008e6d]'>
        <span className='subtitle-18-bold text-white'>병원 가는 중 시작...</span>
      </div>

      {/* Top Layer - Initial State (Light Green) */}
      <div
        className='absolute inset-0 flex items-center justify-center rounded-[1.2rem] bg-[#00c89a] transition-all duration-200'
        style={{
          clipPath: `inset(0 0 0 ${slideProgress}%)`,
          transform: isDragging
            ? 'none'
            : slideProgress > 0
              ? `translateX(-${slideProgress}%)`
              : 'none',
        }}>
        <span className='subtitle-18-bold text-white'>{text || '밀어서 동행 시작'}</span>
      </div>

      {/* Slider Handle - Always on the left */}
      <div className='pointer-events-none absolute top-0 left-0 flex h-full w-[5.6rem] items-center justify-center rounded-[1.2rem] bg-[#008e6d]'>
        <IcChevronDoubleLeft className='h-[2.4rem] w-[2.4rem] rotate-180 text-white' />
      </div>
    </div>
  );
};

export default ButtonCTA;
