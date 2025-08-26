import {
  IcAlertCircle,
  IcCheckCircle,
  IcClockFill,
  IcHomeFill,
  IcHospitalFill,
  IcMarkFill,
} from '@icons';

import { timeFormat } from '@shared/lib';
import { ShowMapButton } from '@shared/ui';

import { type StatusTitleProps } from '@dashboard/types';

const DashBoardCard = ({ children }: { children: React.ReactNode }) => {
  return <div className='shadow-bottom-sheet flex-1'>{children}</div>;
};

const Home = (active: boolean) => {
  return (
    <div
      className={`flex-center h-[2.4rem] w-[2.4rem] rounded-full ${active ? 'bg-background-default-mint' : 'bg-neutral-15'}`}>
      <IcHomeFill
        className={`h-full w-full ${active ? '[&_path]:fill-background-default-white' : '[&_path]:fill-icon-neutral-disabled'}`}
      />
    </div>
  );
};
const Line = (active: boolean) => {
  return (
    <div
      className={`h-[0.4rem] w-[2rem] rounded-full ${active ? 'bg-background-default-mint' : 'bg-neutral-15'}`}
    />
  );
};
const Hospital = (active: boolean) => {
  return (
    <div
      className={`flex-center h-[2.4rem] w-[2.4rem] rounded-full ${active ? 'bg-background-default-mint' : 'bg-neutral-15'}`}>
      <IcHospitalFill
        className={`h-full w-full ${active ? '[&_path]:fill-background-default-white' : '[&_path]:fill-icon-neutral-disabled'}`}
      />
    </div>
  );
};

const ButtonWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className='flex-start flex gap-[0.6rem] py-[0.8rem]'>{children}</div>;
};

const TitleWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-background-default-white flex flex-col gap-[0.8rem] rounded-t-[1.6rem] p-[2rem]'>
      {children}
    </div>
  );
};
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={`bg-background-default-white shadow-card border-stroke-neutral-dark mt-[3.6rem] flex flex-col gap-[0.8rem] rounded-[1.2rem] border p-[1.6rem] ${className}`}>
      {children}
    </div>
  );
};

type StatusTitleComponentProps = {
  escortStatus: StatusTitleProps;
  socketStatus: string;
  nchanStatus: string;
};

const StatusTitle = ({ escortStatus, socketStatus, nchanStatus }: StatusTitleComponentProps) => {
  const statusMap: Record<StatusTitleProps, React.ReactElement[]> = {
    만남중: [Home(true), Line(false), Hospital(false), Line(false), Home(false)],
    병원행: [Home(true), Line(true), Hospital(true), Line(false), Home(false)],
    진료중: [Home(false), Line(false), Hospital(true), Line(false), Home(false)],
    복귀중: [Home(false), Line(false), Hospital(true), Line(true), Home(true)],
  };
  return (
    <div className='flex-between'>
      <div className='flex-start gap-[0.4rem]'>
        {statusMap[escortStatus].map((item: React.ReactElement, index: number) => (
          <div key={index}>{item}</div>
        ))}
      </div>
      <div className='flex-start body2-14-medium text-text-neutral-primary gap-[0.4rem]'>
        {socketStatus === 'connected' && (
          <>
            <IcCheckCircle className='[&_path]:fill-icon-mint-on-primary' />
            <span className='text-text-mint-on-primary'>위치 공유 연결됨</span>
          </>
        )}
        {socketStatus === 'disconnected' && (
          <>
            <IcAlertCircle className='[&_path]:fill-icon-red-on-primary' />
            <span className='text-text-red-primary'>위치 공유 연결 끊김</span>
          </>
        )}
        {nchanStatus === 'connected' && (
          <>
            <IcCheckCircle className='[&_path]:fill-icon-mint-on-primary' />
            <span className='text-text-mint-on-primary'>nchan 연결됨</span>
          </>
        )}
        {nchanStatus === 'disconnected' && (
          <>
            <IcAlertCircle className='[&_path]:fill-icon-red-on-primary' />
            <span className='text-text-red-primary'>nchan 연결 끊김</span>
          </>
        )}
      </div>
    </div>
  );
};

const Title = ({ text }: { text: string }) => {
  return <div className='display-32-bold text-text-neutral-primary'>{text}</div>;
};

const Divider = () => {
  return <div className='bg-stroke-neutral-light h-[0.6rem] w-full' />;
};

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className='flex flex-col gap-[1.2rem] p-[2rem]'>{children}</div>;
};

const ContentTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className='flex flex-col gap-[0.8rem]'>{children}</div>;
};

const TimeContent = ({ time }: { time: string }) => {
  return (
    <div className='flex gap-[0.8rem]'>
      <IcClockFill className='[&_path]:fill-icon-neutral-assistive h-[2.4rem] w-[2.4rem]' />
      <div className='subtitle-18-medium text-text-neutral-primary'>
        {timeFormat(time, 'aaa HH:mm')}
      </div>
    </div>
  );
};

const AddressContent = ({
  detailAddress,
  address,
  placeName,
  position,
}: {
  detailAddress: string;
  address: string;
  placeName: string;
  position: { lat: number; lng: number };
}) => {
  return (
    <div className='flex items-start justify-start gap-[0.8rem]'>
      <IcMarkFill className='[&_path]:fill-icon-neutral-assistive h-[2.4rem] w-[2.4rem]' />
      <div className='flex flex-col gap-[0.4rem]'>
        <div className='subtitle-18-medium text-text-neutral-primary'>{detailAddress}</div>
        <ShowMapButton roadAddress={address} businessAddress={placeName} pos={position} />
      </div>
    </div>
  );
};

DashBoardCard.TitleWrapper = TitleWrapper;
DashBoardCard.StatusTitle = StatusTitle;
DashBoardCard.Title = Title;
DashBoardCard.Divider = Divider;
DashBoardCard.ContentWrapper = ContentWrapper;
DashBoardCard.ContentTitle = ContentTitle;
DashBoardCard.TimeContent = TimeContent;
DashBoardCard.AddressContent = AddressContent;
DashBoardCard.ButtonWrapper = ButtonWrapper;
DashBoardCard.Card = Card;

export default DashBoardCard;
