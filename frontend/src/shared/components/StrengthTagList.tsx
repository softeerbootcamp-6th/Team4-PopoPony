import { StrengthTag } from '@shared/components';

interface Props {
  needsHelping: boolean;
  usesWheelchair: boolean;
  hasCognitiveIssue: boolean;
}

const StrengthTagList = ({ needsHelping, usesWheelchair, hasCognitiveIssue }: Props) => {
  return (
    <div className='flex-start flex-wrap gap-[0.4rem]'>
      {needsHelping && <StrengthTag type='안전한 부축' />}
      {usesWheelchair && <StrengthTag type='휠체어 이동' />}
      {hasCognitiveIssue && <StrengthTag type='인지장애 케어' />}
    </div>
  );
};

export default StrengthTagList;
