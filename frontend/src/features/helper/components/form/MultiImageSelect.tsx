import { useImageUpload } from '@shared/hooks';
import { IcButtonClose, IcCameraFill } from '@icons';
import type { ImagePrefix, ImageWithPreviewUrl } from '@shared/types';
import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  prefix: ImagePrefix;
  maxImageLength: number;
}

const MultiImageSelect = ({ name, prefix, maxImageLength = 2 }: Props) => {
  const { setValue, watch } = useFormContext();
  const { uploadImage } = useImageUpload();

  const currentValue: ImageWithPreviewUrl[] = watch(name) || [];

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files: File[] = Array.from(event.target.files);
      const allowedFiles = files.slice(0, maxImageLength - currentValue.length);

      try {
        const results = await Promise.all(
          allowedFiles.map(async (file) => {
            const imageData = await uploadImage(file, prefix);
            return imageData;
          })
        );

        setValue(name, [...currentValue, ...results], {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = currentValue.filter((_, i) => i !== index);
    setValue(name, newImages, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <section className='flex gap-[0.8rem]'>
      <label
        htmlFor='imgInput'
        className='bg-neutral-10 flex-center border-neutral-20 flex-col-center h-[8rem] w-[8rem] rounded-[0.8rem] border-[1.5px] border-dashed'>
        <IcCameraFill className='[&_path]:fill-icon-neutral-assistive [&_circle]:fill-icon-neutral-assistive' />
        <div className='body2-14-medium text-text-neutral-secondary text-center'>
          최대 {maxImageLength}장
        </div>
      </label>
      <input
        type='file'
        className='hidden'
        multiple={true}
        accept='image/*'
        id='imgInput'
        onChange={handleImageChange}
      />
      <div className='flex gap-[0.8rem]'>
        {(currentValue || []).map((image: ImageWithPreviewUrl, index: number) => (
          <div key={`${image.checksum} - ${index}`} className='relative h-[8rem] w-[8rem]'>
            <img
              src={image.previewUrl}
              alt={`미리보기 이미지 ${index + 1}`}
              className='h-full w-full rounded-[0.8rem] object-cover'
            />
            <div
              onClick={() => handleDeleteImage(index)}
              className='absolute top-[-0.4rem] right-[-0.4rem]'>
              <IcButtonClose className='h-[1.6rem] w-[1.6rem]' />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MultiImageSelect;
