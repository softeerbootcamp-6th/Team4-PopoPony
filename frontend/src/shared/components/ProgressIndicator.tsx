interface ProgressIndicatorProps {
  currentStatus: EscortStatus;
  className?: string;
}

type EscortStatus = '매칭중' | '매칭확정' | '동행중' | '동행완료';

const ESCORT_STEPS: EscortStatus[] = ['매칭중', '매칭확정', '동행중', '동행완료'];

export default function ProgressIndicator({
  currentStatus,
  className = '',
}: ProgressIndicatorProps) {
  const currentStepIndex = ESCORT_STEPS.indexOf(currentStatus);
  const activeLineIndex = [currentStepIndex - 1, currentStepIndex].filter(
    (index) => index >= 0 && index < ESCORT_STEPS.length
  );

  const getStepStyles = (stepIndex: number) => {
    const isTextActive = stepIndex === currentStepIndex;
    const isLineActive = activeLineIndex.includes(stepIndex);

    return {
      text: isTextActive ? 'text-text-mint-primary' : 'text-text-neutral-assistive',
      line: isLineActive ? 'border-text-mint-primary' : 'border-text-neutral-assistive',
    };
  };

  return (
    <div className={`flex-between w-full gap-[0.8rem] px-[1rem] ${className}`}>
      {ESCORT_STEPS.map((step, index) => {
        const styles = getStepStyles(index);
        const isLastStep = index === ESCORT_STEPS.length - 1;

        return (
          <div key={step} className={`flex-center gap-[0.8rem] ${isLastStep ? '' : 'flex-1'}`}>
            <span className={`body2-14-bold whitespace-nowrap ${styles.text}`}>{step}</span>

            {!isLastStep && (
              <div
                className={`border-neutral-60 mx-2 h-[1px] w-full border-t border-dashed ${styles.line}`}
                aria-hidden='true'
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
