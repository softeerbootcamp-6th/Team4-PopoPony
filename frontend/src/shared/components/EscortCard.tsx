import type { ReactNode } from 'react';
import { Button, StatusTag, StrengthTag } from '@components';
import { IcChevronRightSecondary, IcClockFill, IcCoinFill, IcMarkFill } from '@icons';
import type { StatusType } from '@types';

type Props = {
  children: React.ReactNode;
};

const EscortCard = ({ children }: Props) => {
  return (
    <div
      className='bg-background-default-white border-stroke-neutral-dark shadow-card flex w-full cursor-pointer flex-col gap-[1.2rem] rounded-[0.8rem] border p-[1.6rem]'
      // TODO: 삭제 필요
      onClick={() => {
        alert('준비중인 기능이예요');
      }}>
      {children}
    </div>
  );
};

interface CardStatusHeaderProps {
  status?: StatusType;
  text: string;
  title: string;
}

const CardStatusHeader = ({ status, text, title }: CardStatusHeaderProps) => {
  return (
    <>
      <div className='flex-start gap-[0.4rem]'>
        {status && <StatusTag status={status} />}
        <span className='label2-14-medium text-text-neutral-secondary'>{text}</span>
      </div>
      <div className='flex-between mt-[0.6rem] cursor-pointer'>
        <h3 className='subtitle-18-bold text-text-neutral-primary'>{title}</h3>
        <IcChevronRightSecondary />
      </div>
    </>
  );
};

const CardDivider = () => {
  return <div className='bg-stroke-neutral-light h-[0.1rem] w-full' />;
};

const InfoSection = ({ children }: { children: ReactNode }) => {
  return <div className='flex flex-col gap-[0.4rem]'>{children}</div>;
};

interface CardInfoProps {
  type: 'time' | 'location' | 'price';
  text: string;
}

const CardInfo = ({ type, text }: CardInfoProps) => {
  return (
    <div className='flex-start gap-[0.8rem]'>
      {type === 'time' && <IcClockFill />}
      {type === 'location' && <IcMarkFill />}
      {type === 'price' && <IcCoinFill />}
      <span className='label2-14-medium text-text-neutral-secondary'>{text}</span>
    </div>
  );
};

const CardTags = ({ tags }: { tags: ('support' | 'wheelchair' | 'care')[] }) => {
  return (
    <div className='flex-start gap-[0.4rem]'>
      {tags.map((tag) => (
        <StrengthTag key={tag} type={tag} />
      ))}
    </div>
  );
};

const CardButton = ({ onClick }: { onClick: () => void }) => {
  return <Button onClick={onClick}>대시보드 확인하기</Button>;
};

EscortCard.Divider = CardDivider;
EscortCard.StatusHeader = CardStatusHeader;
EscortCard.InfoSection = InfoSection;
EscortCard.Info = CardInfo;
EscortCard.Tag = CardTags;
EscortCard.Button = CardButton;

export default EscortCard;
