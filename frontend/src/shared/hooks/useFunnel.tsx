import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams, useRouter } from '@tanstack/react-router';

type FunnelRoute = '/customer/recruit/$step';
interface UseFunnelProps {
  defaultStep: string;
  basePath: string;
  paramPath: FunnelRoute;
  stepList: string[];
}
interface StepProps {
  name: string;
  children: ReactNode;
}

interface FunnelProps {
  children: Array<ReactElement<StepProps>>;
}

export const useFunnel = ({ defaultStep, basePath, paramPath, stepList }: UseFunnelProps) => {
  const [step, setStep] = useState(defaultStep);
  const navigate = useNavigate();
  const router = useRouter();
  const { step: urlStep } = useParams({ from: paramPath });

  useEffect(() => {
    if (urlStep) {
      setStep(urlStep);
    }
  }, [urlStep]);

  const Step = (props: StepProps): ReactElement => {
    return <>{props.children}</>;
  };

  const Funnel = ({ children }: FunnelProps) => {
    const targetStep = children.find((childStep) => childStep.props.name === step);

    return <>{targetStep}</>;
  };
  const handleBackStep = () => {
    router.history.back();
  };

  const nextStep = () => {
    const currentIndex = stepList.indexOf(step);
    if (currentIndex < stepList.length - 1) {
      const nextStepName = stepList[currentIndex + 1];
      setStep(nextStepName);
      navigate({ to: `/${basePath}/${nextStepName}` });
    }
  };

  return { Funnel, Step, setStep, nextStep, currentStep: step, handleBackStep } as const;
};
