import { z } from 'zod';

// TODO: 추후 schema 타입으로 수정
export type ImagePrefix =
  | 'uploads/certificate'
  | 'uploads/helper'
  | 'uploads/patient'
  | 'uploads/report'
  | 'uploads/taxi'
  | 'uploads/test';

export const imageSchema = z.object({
  s3Key: z.string(),
  contentType: z.string(),
  size: z.number(),
  checksum: z.string(),
});

export type ImageType = z.infer<typeof imageSchema>;

// ImageUploadResult

export interface ImageWithPreviewUrl extends ImageType {
  previewUrl: string;
}
