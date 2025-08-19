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
    <div className='flex-center w-full gap-[0.4rem]'>
      {steps.map((step) => (
        <ProgressBarItem key={step} filled={step <= currentStep} />
      ))}
    </div>
  );
};

const ProgressBarItem = ({ filled }: ProgressBarItemProps) => {
  return (
    <div className='bg-neutral-10 h-[0.6rem] w-full overflow-hidden rounded-full'>
      <div
        className={`bg-background-default-mint h-full rounded-full transition-all duration-500 ease-out ${
          filled ? 'w-full' : 'w-0'
        }`}
      />
    </div>
  );
};

export default ProgressBar;
