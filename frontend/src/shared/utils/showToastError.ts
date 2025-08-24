import { toast } from 'sonner';
import { getErrorLabel } from '@shared/apis';

export const showToastError = (error: unknown) => {
  const label = getErrorLabel(error);
  const message = error instanceof Error ? error.message : '동행 신청에 실패했어요.';
  toast.error(`[${label}] ${message}`);
};
