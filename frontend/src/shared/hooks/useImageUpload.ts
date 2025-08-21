import { useState, useCallback } from 'react';
import type { ImagePrefix, ImageWithPreviewUrl } from '@types';
import { postPresignedUrl, putS3Upload } from '@apis';
import { calculateMD5 } from '@utils';
import { toast } from 'sonner';

export interface UseImageUploadReturn {
  uploadImage: (file: File, prefix: ImagePrefix) => Promise<ImageWithPreviewUrl>;
  isUploading: boolean;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: getPresignedUrl } = postPresignedUrl();

  const uploadImage = useCallback(
    async (file: File, prefix: ImagePrefix): Promise<ImageWithPreviewUrl> => {
      try {
        setIsUploading(true);

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
            prefix,
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
        const result: ImageWithPreviewUrl = {
          ...imageData,
          s3Key,
          previewUrl,
        };

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [getPresignedUrl]
  );

  return {
    uploadImage,
    isUploading,
  };
};

export default useImageUpload;
