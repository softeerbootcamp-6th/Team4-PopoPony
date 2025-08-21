import { DashBoardCard } from '@dashboard/components';

const HelperDashboardSummary = ({
  purpose,
  extraRequest,
  setMemo,
}: {
  purpose: string;
  extraRequest?: string;
  setMemo: (memo: string) => void;
}) => {
  return (
    <DashBoardCard.Card>
      <h5 className='title-20-bold text-text-neutral-primary'>진료 시 참고해주세요</h5>
      <h6 className='body2-14-medium text-text-neutral-secondary mt-[1.6rem]'>병원 방문 목적</h6>
      <p className='body1-16-medium text-text-neutral-primary mt-[0.8rem]'>{purpose}</p>
      <div className='bg-neutral-20 mt-[1.6rem] h-[0.1rem] w-full' />
      {extraRequest && (
        <>
          <h6 className='body2-14-medium text-text-neutral-secondary mt-[1.6rem]'>기타 요청사항</h6>
          <p className='body1-16-medium text-text-neutral-primary mt-[0.8rem]'>{extraRequest}</p>
          <div className='bg-neutral-20 mt-[1.6rem] h-[0.1rem] w-full' />
        </>
      )}
      <h6 className='body2-14-medium text-text-neutral-secondary mt-[1.6rem]'>메모 추가</h6>
      <textarea
        className='body1-16-medium text-text-neutral-primary border-stroke-neutral-dark mt-[0.8rem] rounded-[0.6rem] border px-[1.2rem] py-[1rem]'
        rows={5}
        placeholder='추후 동행 보고서에 작성하는 데 참고할 만한 내용을 적어두세요!'
        onChange={(e) => setMemo(e.target.value)}
      />
    </DashBoardCard.Card>
  );
};

export default HelperDashboardSummary;
