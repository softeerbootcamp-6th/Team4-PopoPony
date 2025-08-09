import { useFormContext } from 'react-hook-form';
import { Button } from '@components';

interface Props {
  selectedCertificates: Array<{ type: string; certificateImageUrl: string }>;
  certificateImages?: Record<string, string>;
}

export const CertificateImageUploader = ({ selectedCertificates }: Props) => {
  const { setValue, watch } = useFormContext();
  const certificateList = watch('certificateList') || [];

  const handleImageUpload = (certificateType: string, fileName: string) => {
    const updatedCertificateList = certificateList.map(
      (cert: { type: string; certificateImageUrl: string }) => {
        if (cert.type === certificateType) {
          return { ...cert, certificateImageUrl: fileName };
        }
        return cert;
      }
    );
    setValue('certificateList', updatedCertificateList);
  };

  const handleFileSelect = (
    certificateType: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(certificateType, file.name);
    }
    // 파일 input 초기화 (같은 파일을 다시 선택할 수 있도록)
    event.target.value = '';
  };

  if (selectedCertificates.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-[1.6rem]'>
      <div className='flex flex-col gap-[1.2rem]'>
        {selectedCertificates.map((certificate) => {
          const hasImage = certificate.certificateImageUrl;

          return (
            <div key={certificate.type} className='flex flex-col gap-[0.8rem]'>
              <div className='flex-between flex gap-[0.8rem]'>
                <input
                  id={`label-${certificate.type}`}
                  type='text'
                  value={hasImage ? hasImage : ''}
                  placeholder={`${certificate.type} 자격 인증 파일 첨부`}
                  disabled
                  className='body1-16-medium text-text-neutral-assistive border-stroke-neutral-dark h-full flex-1 rounded-[0.4rem] border px-[1.2rem]'
                />
                <input
                  type='file'
                  id={`file-${certificate.type}`}
                  accept='image/*'
                  onChange={(e) => handleFileSelect(certificate.type, e)}
                  className='hidden'
                />
                <div className='w-[8.1rem]'>
                  <Button
                    variant='secondary'
                    size='md'
                    onClick={() => document.getElementById(`file-${certificate.type}`)?.click()}>
                    {hasImage ? '변경' : '업로드'}
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
