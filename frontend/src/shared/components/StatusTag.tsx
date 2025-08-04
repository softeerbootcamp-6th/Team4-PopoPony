interface Props {
  status: 'matching' | 'matching-confirmed' | 'escort' | 'escort-completed';
}

const StatusTag = ({ status }: Props) => {
  const statusMap = {
    matching: { label: '매칭중', color: 'bg-background-light-yellow text-text-yellow-on-primary' },
    'matching-confirmed': {
      label: '매칭확정',
      color: 'bg-background-light-blue text-text-blue-on-primary',
    },
    escort: { label: '동행중', color: 'bg-background-light-mint text-text-mint-on-primary' },
    'escort-completed': {
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
