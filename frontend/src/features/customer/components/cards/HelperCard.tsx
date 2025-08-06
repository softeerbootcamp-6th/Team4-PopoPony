import { StrengthTag, Tag } from '@components';
import { IcChevronRightSecondary } from '@icons';

interface Helper {
  id: string;
  name: string;
  age: number;
  gender: '남' | '여';
  profileImage?: string;
  certificates: string[];
  tags: ('support' | 'wheelchair' | 'care')[];
}

interface HelperCardProps {
  helper: Helper;
  onClick?: (helperId: string) => void;
}

const formatCertificates = (certificates: string[]) => {
  if (certificates.length <= 2) {
    return certificates;
  }

  const visibleCerts = certificates.slice(0, 2);
  const hiddenCount = certificates.length - 2;
  return [...visibleCerts, `+${hiddenCount}`];
};

export default function HelperCard({ helper, onClick }: HelperCardProps) {
  const { id, name, age, gender, profileImage, certificates, tags } = helper;
  const displayCertificates = formatCertificates(certificates);

  const handleCardClick = () => {
    onClick?.(id);
  };

  return (
    <div
      className='border-stroke-neutral-dark shadow-card w-full cursor-pointer rounded-[0.8rem] border bg-white p-[1.6rem]'
      onClick={handleCardClick}>
      <div className='flex-center gap-[1.2rem]'>
        <img
          src={profileImage || '/images/default-profile.svg'}
          alt={`${name} 프로필`}
          className='w-[5.6rem h-[5.6rem] object-cover'
        />
        <div className='flex flex-1 flex-col gap-[0.4rem]'>
          <div className='mb-1 flex items-center justify-between'>
            <div className='flex items-center gap-[0.6rem]'>
              <h3 className='subtitle-18-bold text-neutral-90 truncate'>{name} 도우미</h3>
              <span className='label2-14-medium whitespace-nowrap text-neutral-50'>
                ({age}세/{gender})
              </span>
            </div>

            <IcChevronRightSecondary />
          </div>

          <div className='flex flex-wrap items-center gap-[0.4rem]'>
            {displayCertificates.map((cert, index) => (
              <Tag key={index} text={cert} />
            ))}
          </div>
        </div>
      </div>

      <div className='flex-start mt-[1.2rem] gap-[0.4rem]'>
        {tags.map((tag) => (
          <StrengthTag key={tag} type={tag} />
        ))}
      </div>
    </div>
  );
}
