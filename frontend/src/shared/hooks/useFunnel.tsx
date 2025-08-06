import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';

type FunnelRoute = '/customer/recruit/$step';
interface UseFunnelProps {
  defaultStep: string;
  basePath: string;
  paramPath: FunnelRoute;
}
interface StepProps {
  name: string;
  children: ReactNode;
}

interface FunnelProps {
  children: Array<ReactElement<StepProps>>;
}

export const useFunnel = ({ defaultStep, basePath, paramPath }: UseFunnelProps) => {
  const [step, setStep] = useState(defaultStep);
  const navigate = useNavigate();
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

  const nextStep = (next: string, replace = false) => {
    setStep(next);
    navigate({ to: `/${basePath}/${next}`, replace });
  };

  return { Funnel, Step, setStep, nextStep, currentStep: step } as const;
};
