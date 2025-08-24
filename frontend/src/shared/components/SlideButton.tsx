// SlideButton.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimation,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { IcChevronDoubleLeft } from '@icons';
import { cn } from '@shared/libs';

type SlideButtonProps = {
  onConfirm?: () => void;
  threshold?: number; // 0~1 비율, 이 이상 밀면 해제
  initialLabel: string; // 화면 표시 텍스트
  confirmedLabel: string; // 화면 표시 텍스트
  disabled?: boolean;
  className?: string;
};

export default function SlideButton({
  onConfirm,
  threshold = 1,
  initialLabel,
  confirmedLabel,
  disabled = false,
}: SlideButtonProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);

  const [maxX, setMaxX] = useState(0);

  // 진행률: 0 ~ 100
  const progressPct = useTransform(x, [0, Math.max(1, maxX)], [0, 100]);
  // width로 쓸 문자열 퍼센트
  const fillWidth = useTransform(progressPct, (p) => `${p}%`);

  // 오른쪽 여백(%): 100 → 0
  const rightClip = useTransform(progressPct, (p) => `${100 - p}%`);
  // clip-path 템플릿
  const clip = useMotionTemplate`inset(0 ${rightClip} 0 0)`;

  const [unlocked, setUnlocked] = useState(false);

  // 트랙/노브 크기 계산
  useLayoutEffect(() => {
    const calc = () => {
      if (!trackRef.current || !knobRef.current) return;
      const trackW = trackRef.current.clientWidth;
      const knobW = knobRef.current.clientWidth;
      setMaxX(Math.max(0, trackW - knobW));
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  // 해제 후 자동 리셋 옵션
  useEffect(() => {
    if (!unlocked) return;
    controls.start({ x: 0 });
    setUnlocked(false);
  }, [unlocked, controls]);

  const handleDragEnd = async () => {
    if (disabled || unlocked) return;
    const current = x.get();
    const hit = current >= maxX * threshold;
    if (hit) {
      setTimeout(async () => {
        await controls.start({ x: maxX });
        setUnlocked(true);
        onConfirm?.();
      }, 500);
    } else {
      controls.start({ x: 0 }); // 스냅백
    }
  };

  return (
    <div
      ref={trackRef}
      className='bg-background-default-mint relative flex h-[5.6rem] w-full touch-none items-center overflow-hidden rounded-[0.6rem] outline-none select-none'
      role='button'
      aria-label={initialLabel}
      aria-disabled={disabled || unlocked}
      aria-describedby='slide-instructions'
      tabIndex={disabled ? -1 : 0}>
      {/* ✅ 채워지는 배경 레이어 (늘어나는 느낌) */}
      <motion.div
        aria-hidden
        className='bg-mint-70 absolute inset-y-0 left-0 z-20'
        style={{ width: unlocked ? '100%' : fillWidth }}
      />

      {/* 노브: z-index를 가장 높게 */}
      <motion.div
        ref={knobRef}
        className={cn(
          'relative z-30 h-[5.6rem] w-[5.6rem] shrink-0',
          'bg-mint-70',
          'flex items-center justify-center',
          (disabled || unlocked) && 'cursor-not-allowed opacity-60'
        )}
        drag='x'
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{ left: 0, right: maxX }}
        style={{ x }}
        animate={controls}
        onDragEnd={handleDragEnd}
        onPointerDown={(e) => {
          if (disabled || unlocked) e.preventDefault();
        }}>
        <IcChevronDoubleLeft className='[&_path]:fill-white' />
      </motion.div>

      {/* 라벨: 아래층 = 초기 라벨 */}
      <div
        id='slide-instructions'
        className='subtitle-18-bold text-neutral-0 pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
        {initialLabel}
      </div>

      {/* 라벨: 위층 = 확장되며 드러나는 확정 라벨 */}
      <motion.div
        aria-hidden
        className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center'
        style={{ clipPath: unlocked ? 'inset(0 0 0 0)' : clip }}>
        <span className='subtitle-18-bold text-neutral-0'>{confirmedLabel}</span>
      </motion.div>
    </div>
  );
}
