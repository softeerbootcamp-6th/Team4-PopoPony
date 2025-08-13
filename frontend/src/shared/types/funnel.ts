export type FunnelRoute =
  | '/customer/recruit/$step'
  | '/helper/profile/new/$step'
  | '/helper/escort/$escortId/report/$step';

export type FunnelStepProps = { handleNextStep: () => void; handleBackStep?: () => void };
