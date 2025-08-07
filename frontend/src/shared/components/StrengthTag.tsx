import { IcRecognize, IcShoes, IcWheelchair } from '@icons';
import Tag from './Tag';

interface Props {
  type: 'support' | 'wheelchair' | 'care';
}

const StrengthTag = ({ type }: Props) => {
  const typeMap = {
    support: { icon: <IcShoes />, label: '안전한 부축' },
    wheelchair: { icon: <IcWheelchair />, label: '휠체어 이동' },
    care: { icon: <IcRecognize />, label: '인지장애 케어' },
  };
  return <Tag icon={typeMap[type].icon} text={typeMap[type].label} />;
};

export default StrengthTag;
