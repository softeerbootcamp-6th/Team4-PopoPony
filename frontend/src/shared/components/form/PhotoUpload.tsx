import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { IcCamera, IcEdit } from '@icons';
import { useImageUpload } from '@hooks';
import type { ImagePrefix } from '@types';

interface Props {
  name: string;
  prefix: ImagePrefix;
}

const PhotoUpload = ({ name, prefix }: Props) => {
  const { setValue, watch } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, isUploading } = useImageUpload();

  const currentValue = watch(name);
  const hasImage = Boolean(currentValue?.previewUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await uploadImage(file, prefix);
      setValue(
        name,
        {
          ...imageData,
        },
        { shouldValidate: true, shouldDirty: true }
      );
    } catch (err) {
      console.error(err);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
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
        {hasImage ? (
          <img
            src={currentValue.previewUrl}
            alt='미리보기'
            className='absolute inset-0 h-full w-full rounded-full object-cover'
          />
        ) : (
          <>
            <div className='relative h-6 w-6'>
              <IcCamera className='h-full w-full text-neutral-50' />
            </div>
            <div className='body1-16-medium text-neutral-70 text-center'>
              {isUploading ? '업로드 중...' : '환자 사진'}
            </div>
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
      </button>
    </div>
  );
};

export default PhotoUpload;
