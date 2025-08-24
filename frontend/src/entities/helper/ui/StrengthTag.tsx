import { IcRecognize, IcShoes, IcWheelchair } from '@icons';
import type { EscortStrength } from '@entities/escort/types';
import { Tag } from '@shared/ui';

interface TagProps {
  type: EscortStrength;
}

interface TagListProps {
  needsHelping: boolean;
  usesWheelchair: boolean;
  hasCognitiveIssue: boolean;
}

const StrengthTag = ({ type }: TagProps) => {
  const iconMap = {
    '안전한 부축': <IcShoes />,
    '휠체어 이동': <IcWheelchair />,
    '인지장애 케어': <IcRecognize />,
  };
  return <Tag icon={iconMap[type]} text={type} />;
};

const StrengthTagList = ({ needsHelping, usesWheelchair, hasCognitiveIssue }: TagListProps) => {
  return (
    <div className='flex-start flex-wrap gap-[0.4rem]'>
      {needsHelping && <StrengthTag type='안전한 부축' />}
      {usesWheelchair && <StrengthTag type='휠체어 이동' />}
      {hasCognitiveIssue && <StrengthTag type='인지장애 케어' />}
    </div>
  );
};

export { StrengthTag, StrengthTagList };
