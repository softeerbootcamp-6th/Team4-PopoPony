import { type StatusTitleProps } from '@dashboard/types';
import { IcHomeFill, IcHospitalFill, IcClockFill, IcMarkFill } from '@icons';

const DashBoardCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-background-default-white shadow-card shadow-bottom-sheet flex-1 rounded-t-[1.6rem]'>
      {children}
    </div>
  );
};

const Home = (active: boolean) => {
  return (
    <div
      className={`flex-center h-[2.4rem] w-[2.4rem] rounded-full ${active ? 'bg-neutral-15' : 'bg-background-default-mint'}`}>
      <IcHomeFill
        className={`h-[1.6rem] w-[1.6rem] ${active ? '[&_path]:fill-icon-neutral-disabled' : '[&_path]:fill-background-default-white'}`}
      />
    </div>
  );
};
const Line = (active: boolean) => {
  return (
    <div
      className={`h-[0.4rem] w-[2rem] rounded-full ${active ? 'bg-neutral-15' : 'bg-background-default-mint'}`}
    />
  );
};
const Hospital = (active: boolean) => {
  return (
    <div
      className={`flex-center h-[2.4rem] w-[2.4rem] rounded-full ${active ? 'bg-neutral-15' : 'bg-background-default-mint'}`}>
      <IcHospitalFill
        className={`h-[1.6rem] w-[1.6rem] ${active ? '[&_path]:fill-icon-neutral-disabled' : '[&_path]:fill-background-default-white'}`}
      />
    </div>
  );
};

const TitleWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className='flex flex-col gap-[0.8rem] p-[2rem]'>{children}</div>;
};

type StatusTitleComponentProps = { escortStatus: StatusTitleProps };

const StatusTitle = ({ escortStatus }: StatusTitleComponentProps) => {
  const statusMap: Record<StatusTitleProps, React.ReactElement[]> = {
    만남중: [Home(true), Line(false), Hospital(false), Line(false), Home(false)],
    병원행: [Home(true), Line(true), Hospital(true), Line(false), Home(false)],
    진료중: [Home(false), Line(false), Hospital(true), Line(false), Home(false)],
    복귀중: [Home(false), Line(false), Hospital(true), Line(true), Home(true)],
  };
  return (
    <div className='flex-start gap-[0.4rem]'>
      {statusMap[escortStatus].map((item: React.ReactElement, index: number) => (
        <div key={index}>{item}</div>
      ))}
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
  return <div className='flex flex-col gap-[0.8rem] p-[2rem]'>{children}</div>;
};

const TimeContent = (time: string) => {
  return (
    <div className='flex flex-col gap-[0.8rem]'>
      <IcClockFill className='h-[1.6rem] w-[1.6rem]' />
      <div className='subtitle-18-medium text-text-neutral-primary'>{time}</div>
    </div>
  );
};

const AddressContent = ({
  detailAddress,
  address,
  placeName,
}: {
  detailAddress: string;
  address: string;
  placeName: string;
}) => {
  return (
    <div className='flex items-start justify-start gap-[0.8rem]'>
      <IcMarkFill className='h-[1.6rem] w-[1.6rem]' />
      <div className='flex flex-col gap-[0.4rem]'>
        <div className='subtitle-18-medium text-text-neutral-primary'>{detailAddress}</div>
        <div className='body2-14-medium text-text-neutral-secondary'>
          {address} {placeName}{' '}
          <span>
            <button className='caption2-10-medium text-text-neutral-secondary border-stroke-neutral-dark w-fit translate-y-[-0.1rem] rounded-[0.4rem] border px-[0.5rem] py-[0.2rem]'>
              지도 보기
            </button>
          </span>
        </div>
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

export default DashBoardCard;
