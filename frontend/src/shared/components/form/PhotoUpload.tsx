import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IcCamera, IcEdit } from '@icons';

interface Props {
  name: string;
}

const PhotoUpload = ({ name }: Props) => {
  const { setValue, watch } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string>(''); // blob URL or dataURL
  const currentValue = watch(name) as string | undefined;

  // 미리보기 소스: 로컬 상태 우선, 없으면 폼 값 사용
  const previewSrc = imageSrc || currentValue || '';
  const hasImage = Boolean(previewSrc);

  // blob URL 정리
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 선택할 수 있습니다.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      e.target.value = '';
      return;
    }

    // ✅ FileReader 대신 blob URL 사용
    const blobUrl = URL.createObjectURL(file);
    setImageSrc(blobUrl);
    // 폼에도 같은 값을 저장(업로드 전 임시 프리뷰용이라면 blobUrl을 저장)
    setValue(name, blobUrl, { shouldValidate: true, shouldDirty: true });

    // 같은 파일 재선택 가능하게 초기화
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
        type='file'
        accept='image/*'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
      />

      <button
        type='button'
        onClick={!hasImage ? handleUploadClick : undefined}
        className={`relative flex h-[16rem] w-[16rem] flex-col items-center justify-center gap-1 rounded-full transition-all duration-200 ease-in-out ${
          hasImage
            ? ''
            : 'bg-neutral-10 border-neutral-20 border-[1.5px] border-dashed hover:opacity-80 active:scale-95'
        }`}>
        {/* ✅ previewSrc 기준으로 렌더 */}
        {previewSrc && (
          <img
            src={previewSrc}
            alt='미리보기'
            className='absolute inset-0 h-full w-full rounded-full object-cover'
          />
        )}

        {!hasImage && (
          <>
            <div className='relative h-6 w-6'>
              <IcCamera className='h-full w-full text-neutral-50' />
            </div>
            <div className='body1-16-medium text-neutral-70 text-center'>환자 사진</div>
          </>
        )}

        {hasImage && (
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
