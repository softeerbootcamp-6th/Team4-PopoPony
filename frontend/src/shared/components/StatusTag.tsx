
import type { StatusType } from '@types';

const StatusTag = ({ status }: { status: StatusType }) => {
  const statusMap = {
    MATCHING: { label: '매칭중', color: 'bg-background-light-yellow text-text-yellow-on-primary' },
    COMPLETED: {
      label: '매칭확정',
      color: 'bg-background-light-blue text-text-blue-on-primary',
    },
    IN_PROGRESS: { label: '동행중', color: 'bg-background-light-mint text-text-mint-on-primary' },
    MEETING: {
      label: '동행중',
      color: 'bg-background-light-mint text-text-mint-on-primary',
    },
    HEADING_TO_HOSPITAL: {
      label: '동행중',
      color: 'bg-background-light-mint text-text-mint-on-primary',
    },
    IN_TREATMENT: {
      label: '동행중',
      color: 'bg-background-light-mint text-text-mint-on-primary',
    },
    RETURNING: {
      label: '동행중',
      color: 'bg-background-light-mint text-text-mint-on-primary',
    },
    DONE: {
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
