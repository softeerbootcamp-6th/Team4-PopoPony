import { IcRecognize, IcShoes, IcWheelchair } from '@icons';
import type { EscortStrength } from '@shared/types';
import Tag from './Tag';

interface Props {
  type: EscortStrength;
}

const StrengthTag = ({ type }: Props) => {
  const iconMap = {
    '안전한 부축': <IcShoes />,
    '휠체어 이동': <IcWheelchair />,
    '인지장애 케어': <IcRecognize />,
  };
  return <Tag icon={iconMap[type]} text={type} />;
};

export default StrengthTag;
