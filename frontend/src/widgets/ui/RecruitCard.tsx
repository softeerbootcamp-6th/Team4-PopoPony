import { IcChevronRightSecondary, IcClockFill, IcCoinFill, IcMarkFill } from '@icons';

import type { ReactNode } from 'react';

import type { EscortStrength } from '@entities/escort/types';
import { StrengthTag } from '@entities/helper/ui';
import { RecruitStatusTag } from '@entities/recruit/ui';

import type { RecruitStatus } from '@shared/types';
import { Button } from '@shared/ui';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const RecruitCard = ({ children, onClick, className = 'cursor-pointer' }: Props) => {
  return (
    <div
      className={`bg-background-default-white border-stroke-neutral-dark shadow-card flex w-full flex-col gap-[1.2rem] rounded-[0.8rem] border p-[1.6rem] ${className}`}
      onClick={() => {
        if (onClick) onClick();
      }}>
      {children}
    </div>
  );
};

interface CardStatusHeaderProps {
  status?: RecruitStatus;
  text: string;
  title: string;
  hasOnClickEvent?: boolean;
}

const CardStatusHeader = ({
  status,
  text,
  title,
  hasOnClickEvent = true,
}: CardStatusHeaderProps) => {
  return (
    <>
      <div className='flex-start gap-[0.4rem]'>
        {status && <RecruitStatusTag status={status} />}
        <span className='label2-14-medium text-text-neutral-secondary'>{text}</span>
      </div>
      <div className='flex-between mt-[0.6rem]'>
        <h3 className='subtitle-18-bold text-text-neutral-primary'>{title}</h3>
        {hasOnClickEvent && <IcChevronRightSecondary />}
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

const CardTags = ({ tags }: { tags: EscortStrength[] }) => {
  return (
    <div className='flex-start gap-[0.4rem]'>
      {tags.map((tag) => (
        <StrengthTag key={tag} type={tag} />
      ))}
    </div>
  );
};

const CardButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}>
      대시보드 확인하기
    </Button>
  );
};

RecruitCard.Divider = CardDivider;
RecruitCard.StatusHeader = CardStatusHeader;
RecruitCard.InfoSection = InfoSection;
RecruitCard.Info = CardInfo;
RecruitCard.Tag = CardTags;
RecruitCard.DashboardButton = CardButton;

export default RecruitCard;
