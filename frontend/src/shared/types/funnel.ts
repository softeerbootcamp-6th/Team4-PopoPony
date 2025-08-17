export type FunnelRoute =
  | '/customer/recruit/$step'
  | '/helper/profile/new/$step'
  | '/helper/escort/$escortId/report/$step'
  | '/customer/escort/$escortId/$helperId/review/$step';

export type FunnelStepProps = { handleNextStep?: () => void; handleBackStep?: () => void };
