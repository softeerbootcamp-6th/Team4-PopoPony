import type { components } from '@schema';
import type { ImageWithPreviewUrl } from '@types';

export * from './ProfileFormValues';
export * from './ProfileStepTypes';
export * from './schemaTypes';

export type ReportFormValues = Omit<
  components['schemas']['ReportCreateRequest'],
  'imageCreateRequestList' | 'taxiFeeCreateRequest'
> & {
  imageCreateRequestList: ImageWithPreviewUrl[];
  taxiFeeCreateRequest: {
    departureFee: number;
    departureReceipt: ImageWithPreviewUrl;
    returnFee: number;
    returnReceipt: ImageWithPreviewUrl;
  };
};
