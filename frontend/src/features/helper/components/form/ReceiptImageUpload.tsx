import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { IcCheckBox, IcEdit } from '@icons';
import { useImageUpload } from '@hooks';
import type { ImagePrefix } from '@types';

interface Props {
  name: string;
  prefix: ImagePrefix;
  placeholder: string;
}

const ReceiptImageUpload = ({ name, prefix, placeholder }: Props) => {
  const { setValue, watch } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, isUploading } = useImageUpload();

  const currentValue = watch(name);
  const hasImage = Boolean(currentValue?.previewUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { imageData, previewUrl } = await uploadImage(file, prefix);
      setValue(
        name,
        {
          imageData,
          previewUrl,
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
        className={`relative flex h-[16rem] w-[16rem] flex-col items-center justify-center gap-1 rounded-[0.8rem] transition-all duration-200 ease-in-out ${
          hasImage
            ? ''
            : 'bg-neutral-10 border-neutral-20 border-[1.5px] border-dashed hover:opacity-80 active:scale-95'
        } ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}>
        {/* 이미지 미리보기 */}
        {hasImage && (
          <img
            src={currentValue.previewUrl}
            alt='미리보기'
            className='absolute inset-0 h-full w-full rounded-[0.8rem] object-cover'
          />
        )}

        <>
          {hasImage && (
            <div className='bg-black-opacity-60 absolute inset-0 h-full w-full rounded-[0.8rem]' />
          )}
          <div className='flex-col-center absolute gap-[0.4rem]'>
            <div className='flex-start gap-[0.8rem]'>
              <div
                className={`${
                  hasImage ? 'bg-mint-50' : 'bg-icon-neutral-disabled'
                } flex-center h-[2.4rem] w-[2.4rem] rounded-full`}>
                <IcCheckBox />
              </div>
              {hasImage && <span className='text-mint-50 body1-16-bold'>업로드 완료</span>}
            </div>

            <div
              className={`body1-16-medium ${
                hasImage ? 'text-background-default-white' : 'text-text-neutral-secondary'
              } text-center`}>
              {placeholder} 요금
              <br />
              영수증
            </div>
          </div>
        </>

        {/* 수정 버튼 */}
        {hasImage && !isUploading && (
          <div
            className='border-neutral-0 hover:bg-neutral-90 absolute right-[0.8rem] bottom-[0.8rem] z-10 flex h-[3.6rem] w-[3.6rem] items-center justify-center rounded-full border bg-neutral-100 transition-all duration-200 ease-in-out active:scale-95'
            onClick={handleEditClick}>
            <IcEdit className='text-neutral-0 h-[2.4rem] w-[2.4rem]' />
          </div>
        )}
      </button>
    </div>
  );
};

export default ReceiptImageUpload;
