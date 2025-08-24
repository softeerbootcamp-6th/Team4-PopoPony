import { useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { useImageUpload } from '@shared/hooks';
import type { ImagePrefix } from '@shared/types';
import { Button } from '@shared/ui';

import type { CertificateItemValues } from '@helper/types';

interface Props {
  selectedCertificates: Array<CertificateItemValues>;
  prefix: ImagePrefix;
}

const CertificateImageUploader = ({ selectedCertificates, prefix }: Props) => {
  const { setValue, watch } = useFormContext();
  const { uploadImage } = useImageUpload();
  const certificateList: Array<CertificateItemValues> = watch('certificateList') || [];
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const handleFileSelect = async (
    certificateType: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingType(certificateType);
      const imageData = await uploadImage(file, prefix);

      const updatedCertificateList = certificateList.map((cert) => {
        if (cert.type === certificateType) {
          return {
            ...cert,
            certificateImageCreateRequest: { ...imageData },
          };
        }
        return cert;
      });

      setValue('certificateList', updatedCertificateList, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err) {
      console.error(err);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      event.target.value = '';
      setUploadingType(null);
    }
  };

  if (selectedCertificates.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-[1.6rem]'>
      <div className='flex flex-col gap-[1.2rem]'>
        {selectedCertificates.map((certificate) => {
          const hasImage = Boolean(certificate.certificateImageCreateRequest);

          return (
            <div key={certificate.type} className='flex flex-col gap-[0.8rem]'>
              <div className='flex-between flex gap-[0.8rem]'>
                <input
                  id={`label-${certificate.type}`}
                  type='text'
                  value={hasImage ? '업로드 완료' : ''}
                  placeholder={`${certificate.type} 자격 인증 파일 첨부`}
                  disabled
                  className='body1-16-medium text-text-neutral-assistive border-stroke-neutral-dark h-full flex-1 rounded-[0.4rem] border px-[1.2rem]'
                />
                <input
                  type='file'
                  id={`file-${certificate.type}`}
                  accept='image/*'
                  onChange={(e) => void handleFileSelect(certificate.type, e)}
                  className='hidden'
                  disabled={uploadingType === certificate.type}
                />
                <div className='w-[8.1rem]'>
                  <Button
                    variant='secondary'
                    size='md'
                    disabled={uploadingType === certificate.type}
                    onClick={() => document.getElementById(`file-${certificate.type}`)?.click()}>
                    {uploadingType === certificate.type
                      ? '업로드 중...'
                      : hasImage
                        ? '변경'
                        : '업로드'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CertificateImageUploader;
