import { z } from 'zod';

export const imageSchema = z.object({
  s3Key: z.string(),
  contentType: z.string(),
  size: z.number(),
  checksum: z.string(),
});

export type ImageType = z.infer<typeof imageSchema>;

// Presigned URL 관련 타입들 (API 스키마와 일치)
export interface PresignedUrlRequest {
  prefix: string;
  files: Array<{
    contentType: string;
    size: number;
    checksum: string;
  }>;
}

export interface PresignedUrlResponse {
  items: Array<{
    s3Key: string;
    uploadUrl: string;
    requiredHeaders: Record<string, string>;
    previewUrl: string;
  }>;
}

export interface ImageUploadResult {
  imageData: {
    s3Key: string;
    contentType: string;
    size: number;
    checksum: string;
  };
  previewUrl: string;
}

export interface ImageUploadOptions {
  prefix?: string;
  allowedTypes?: string[];
}
