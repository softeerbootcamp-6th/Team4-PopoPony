import { useState, useCallback } from 'react';
import type { ImageUploadResult, ImageUploadOptions } from '@types';
import { postPresignedUrl, putS3Upload } from '@apis';
import { calculateMD5 } from '@utils';

export interface UseImageUploadReturn {
  uploadImage: (file: File, options?: ImageUploadOptions) => Promise<ImageUploadResult>;
  isUploading: boolean;
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  prefix: 'uploads',
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
};

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: getPresignedUrl } = postPresignedUrl();

  const validateFile = useCallback((file: File, options: Required<ImageUploadOptions>): void => {
    // 파일 타입 검증
    if (!options.allowedTypes.includes(file.type)) {
      throw new Error(
        `지원하지 않는 파일 형식입니다. 지원 형식: ${options.allowedTypes.join(', ')}`
      );
    }
  }, []);

  const uploadImage = useCallback(
    async (file: File, userOptions?: ImageUploadOptions): Promise<ImageUploadResult> => {
      const options = { ...DEFAULT_OPTIONS, ...userOptions };

      try {
        setIsUploading(true);

        // 1. 파일 검증
        validateFile(file, options);

        // 2. MD5 checksum 계산
        const checksum = await calculateMD5(file);
        const imageData = {
          contentType: file.type,
          size: file.size,
          checksum,
        };

        // 3. Presigned URL 요청
        const presignedResponse = await getPresignedUrl({
          body: {
            prefix: options.prefix,
            files: [
              {
                ...imageData,
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

        // 4. S3에 파일 업로드
        await putS3Upload(file, uploadUrl, headers);

        // 5. 결과 반환
        const result: ImageUploadResult = {
          imageData: {
            ...imageData,
            s3Key,
          },
          previewUrl,
        };

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.';
        throw new Error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile, getPresignedUrl]
  );

  return {
    uploadImage,
    isUploading,
  };
};

export default useImageUpload;
