import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IcCamera, IcEdit } from '@icons';
import { useImageUpload } from '@hooks';
import type { ImageType } from '@types';

interface Props {
  name: string;
  prefix?: string;
}

const PhotoUpload = ({ name, prefix = 'profile-images' }: Props) => {
  const { setValue, watch } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const { uploadImage, isUploading, uploadProgress, error, resetError } = useImageUpload();

  const currentValue = watch(name) as ImageType | undefined;
  const previewSrc = localPreview || currentValue?.imageUrl;
  const hasImage = Boolean(previewSrc);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      resetError();

      // 즉시 미리보기 표시 (blob URL)
      const blobUrl = URL.createObjectURL(file);
      setLocalPreview(blobUrl);

      // S3에 업로드
      const uploadResult = await uploadImage(file, {
        prefix,
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress}%`);
        },
      });

      // 업로드 성공 시 폼 값 업데이트 (previewUrl 사용)
      setValue(
        name,
        {
          imageUrl: uploadResult.imageUrl, // previewUrl
        },
        { shouldValidate: true, shouldDirty: true }
      );

      // 로컬 미리보기 정리하고 서버 URL로 변경
      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
    } catch (err) {
      // 에러 발생 시 미리보기 정리
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
        setLocalPreview(null);
      }
      alert(err instanceof Error ? err.message : '업로드에 실패했습니다.');
    }

    // 파일 input 초기화
    e.target.value = '';
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUploadClick();
  };

  return (
    <div className='relative'>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
        disabled={isUploading}
      />

      <button
        type='button'
        onClick={!hasImage ? handleUploadClick : undefined}
        disabled={isUploading}
        className={`relative flex h-[16rem] w-[16rem] flex-col items-center justify-center gap-1 rounded-full transition-all duration-200 ease-in-out ${
          hasImage
            ? ''
            : 'bg-neutral-10 border-neutral-20 border-[1.5px] border-dashed hover:opacity-80 active:scale-95'
        } ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}>
        {/* 이미지 미리보기 */}
        {previewSrc && (
          <img
            src={previewSrc}
            alt='미리보기'
            className='absolute inset-0 h-full w-full rounded-full object-cover'
          />
        )}

        {/* 업로드 영역 */}
        {!hasImage && (
          <>
            <div className='relative h-6 w-6'>
              <IcCamera className='h-full w-full text-neutral-50' />
            </div>
            <div className='body1-16-medium text-neutral-70 text-center'>
              {isUploading ? '업로드 중...' : '환자 사진'}
            </div>
            {isUploading && (
              <div className='caption-12-medium text-neutral-50'>{uploadProgress}%</div>
            )}
          </>
        )}

        {/* 수정 버튼 */}
        {hasImage && !isUploading && (
          <div
            className='border-neutral-0 hover:bg-neutral-90 absolute right-0 bottom-[0.8rem] z-10 flex h-[4rem] w-[4rem] items-center justify-center rounded-full border bg-neutral-100 transition-all duration-200 ease-in-out active:scale-95'
            onClick={handleEditClick}>
            <IcEdit className='text-neutral-0 h-[2.4rem] w-[2.4rem]' />
          </div>
        )}

        {/* 업로드 중 오버레이 */}
        {isUploading && hasImage && (
          <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black'>
            <div className='text-center text-white'>
              <div className='body1-16-medium'>업로드 중...</div>
              <div className='caption-12-medium'>{uploadProgress}%</div>
            </div>
          </div>
        )}
      </button>

      {/* 에러 메시지 */}
      {error && (
        <div className='text-status-danger caption-12-medium mt-[0.4rem] text-center'>{error}</div>
      )}
    </div>
  );
};

export default PhotoUpload;
