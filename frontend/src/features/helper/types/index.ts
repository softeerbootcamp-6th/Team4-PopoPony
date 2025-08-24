import type { components } from '@schema';

import type { ImageWithPreviewUrl } from '@shared/types';

export * from './ProfileFormValues';
export * from './ProfileStepTypes';
export * from './schemaTypes';

export type ReportFormValues = Omit<
  components['schemas']['ReportCreateRequest'],
  'imageCreateRequestList' | 'taxiFeeCreateRequest'
> & {
  reservationDate?: string;
  reservationTime?: string;
  imageCreateRequestList: ImageWithPreviewUrl[];
  taxiFeeCreateRequest: {
    departureFee: string;
    departureReceipt: ImageWithPreviewUrl;
    returnFee: string;
    returnReceipt: ImageWithPreviewUrl;
  };
};
