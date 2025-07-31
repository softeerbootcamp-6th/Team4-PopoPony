interface ProgressBarProps {
  maxStep: number;
  currentStep: number;
}

interface ProgressBarItemProps {
  filled: boolean;
}

const ProgressBar = ({ maxStep, currentStep }: ProgressBarProps) => {
  const steps = Array.from({ length: maxStep }, (_, index) => index + 1);

  return (
    <div className='flex w-full items-center gap-[1rem]'>
      {steps.map((step) => (
        <ProgressBarItem key={step} filled={step <= currentStep} />
      ))}
    </div>
  );
};

const ProgressBarItem = ({ filled }: ProgressBarItemProps) => {
  return (
    <span
      className={`h-[0.6rem] w-full rounded-full ${filled ? 'bg-background-default-mint' : 'bg-neutral-10'}`}></span>
  );
};

export default ProgressBar;
