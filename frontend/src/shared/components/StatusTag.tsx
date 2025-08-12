import type { RecruitStatus } from '@types';

const StatusTag = ({ status }: { status: RecruitStatus }) => {
  const statusMap = {
    매칭중: { label: '매칭중', color: 'bg-background-light-yellow text-text-yellow-on-primary' },
    매칭완료: {
      label: '매칭확정',
      color: 'bg-background-light-blue text-text-blue-on-primary',
    },
    동행중: { label: '동행중', color: 'bg-background-light-mint text-text-mint-on-primary' },
    동행완료: {
      label: '동행완료',
      color: 'bg-neutral-15 text-text-neutral-secondary',
    },
  };

  return (
    <div
      className={`label2-14-bold rounded-full px-[0.7rem] py-[0.2rem] ${statusMap[status].color}`}>
      {statusMap[status].label}
    </div>
  );
};

export default StatusTag;
