import { StrengthTag, Tag } from '@components';
import { IcChevronRightSecondary } from '@icons';
import type { EscortStrength } from '@types';
import type { HelperSimpleResponse } from '@customer/types';
import { STRENGTH_OPTIONS } from '@helper/types';
import { formatImageUrl } from '@utils';

interface HelperCardProps {
  helper: HelperSimpleResponse;
  onClick?: (helperId: string) => void;
}

const formatCertificates = (certificates: string[]) => {
  if (certificates && certificates.length <= 2) {
    return certificates;
  }

  const visibleCerts = certificates && certificates.slice(0, 2);
  const hiddenCount = certificates && certificates.length - 2;
  return [...(visibleCerts || []), `+${hiddenCount}`];
};

const sortStrengthList = (strengthList: string[]) => {
  //순서 보장 sort 알고리즘
  const orderMap = new Map<string, number>(
    STRENGTH_OPTIONS.map((option, index) => [option.value, index] as const)
  );
  return [...strengthList].sort((a, b) => {
    const aOrder = orderMap.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = orderMap.get(b) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
};

export default function HelperCard({ helper, onClick }: HelperCardProps) {
  const { helperProfileId, name, age, gender, imageUrl, certificateList, strengthList } = helper;
  const displayCertificates = formatCertificates(certificateList);

  const handleCardClick = () => {
    onClick?.(helperProfileId.toString());
  };

  return (
    <div
      className='border-stroke-neutral-dark shadow-card w-full cursor-pointer rounded-[0.8rem] border bg-white p-[1.6rem]'
      onClick={handleCardClick}>
      <div className='flex-center gap-[1.2rem]'>
        <img
          src={formatImageUrl(imageUrl) || '/images/default-profile.svg'}
          alt={`${name} 프로필`}
          className='h-[5.6rem] w-[5.6rem] rounded-full object-cover'
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

      <div className='flex-start mt-[1.2rem] flex-wrap gap-[0.4rem]'>
        {strengthList &&
          sortStrengthList(strengthList).map((strength) => (
            <StrengthTag key={strength} type={strength as EscortStrength} />
          ))}
      </div>
    </div>
  );
}
