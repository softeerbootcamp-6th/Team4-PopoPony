import { useState, useCallback } from 'react';
import type { ImageUploadResult, ImageUploadOptions } from '@types';
import { postPresignedUrl, putS3Upload } from '@apis';
import { calculateMD5 } from '@utils';

export interface UseImageUploadReturn {
  uploadImage: (file: File, options?: ImageUploadOptions) => Promise<ImageUploadResult>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  resetError: () => void;
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  prefix: 'uploads',
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  onProgress: () => {},
};

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: getPresignedUrl } = postPresignedUrl();

  const validateFile = useCallback((file: File, options: Required<ImageUploadOptions>): void => {
    // 파일 타입 검증
    if (!options.allowedTypes.includes(file.type)) {
      throw new Error(
        `지원하지 않는 파일 형식입니다. 지원 형식: ${options.allowedTypes.join(', ')}`
      );
    }

    // 파일 크기 검증
    if (file.size > options.maxSizeBytes) {
      const maxSizeMB = Math.round(options.maxSizeBytes / (1024 * 1024));
      throw new Error(`파일 크기가 너무 큽니다. 최대 ${maxSizeMB}MB까지 업로드 가능합니다.`);
    }
  }, []);

  const uploadImage = useCallback(
    async (file: File, userOptions?: ImageUploadOptions): Promise<ImageUploadResult> => {
      const options = { ...DEFAULT_OPTIONS, ...userOptions };

      try {
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        // 1. 파일 검증
        validateFile(file, options);
        options.onProgress(10);
        setUploadProgress(10);

        // 2. MD5 checksum 계산
        const checksum = await calculateMD5(file);
        options.onProgress(20);
        setUploadProgress(20);

        // 3. Presigned URL 요청
        const presignedResponse = await getPresignedUrl({
          body: {
            prefix: options.prefix,
            files: [
              {
                contentType: file.type,
                size: file.size,
                checksum: 'gviXmZkvmfAQ9W/lUCJjaQ==',
              },
            ],
          },
        });

        if (!presignedResponse.data?.items?.[0]) {
          throw new Error('Presigned URL 생성에 실패했습니다.');
        }

        const { uploadUrl, requiredHeaders, previewUrl, s3Key } = presignedResponse.data.items[0];

        if (!uploadUrl || !previewUrl || !s3Key) {
          throw new Error('Presigned URL 응답에 필수 필드가 누락되었습니다.');
        }

        const headers = requiredHeaders || {};
        options.onProgress(40);
        setUploadProgress(40);

        // 4. S3에 파일 업로드
        await putS3Upload(file, uploadUrl, headers);
        options.onProgress(90);
        setUploadProgress(90);

        // 5. 결과 반환
        const result: ImageUploadResult = {
          imageUrl: previewUrl,
          s3Key,
          checksum,
        };

        options.onProgress(100);
        setUploadProgress(100);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000); // 1초 후 진행률 초기화
      }
    },
    [validateFile, getPresignedUrl]
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadImage,
    isUploading,
    uploadProgress,
    error,
    resetError,
  };
};

export default useImageUpload;
