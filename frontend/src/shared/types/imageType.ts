import { z } from 'zod';

export const imageSchema = z.object({
  imageUrl: z.string().min(1, { message: '이미지를 선택해주세요' }),
  //   s3_key: z.string().optional(),
  //   md5: z.string().optional(),
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
  imageUrl: string;
  s3Key: string;
  checksum: string;
}

export interface ImageUploadOptions {
  prefix?: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}
