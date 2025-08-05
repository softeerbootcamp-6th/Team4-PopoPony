interface ShowMapButtonProps {
  roadAddress: string;
  businessAddress: string;
}

const ShowMapButton = ({ roadAddress, businessAddress }: ShowMapButtonProps) => {
  return (
    <div className='body2-14-medium text-text-neutral-secondary flex-start gap-[0.4rem]'>
      <span className='mr-[0.4rem]'>{roadAddress}</span>
      <span className='mr-[0.4rem]'>{businessAddress}</span>
      <div></div>
      <button className='caption2-10-medium text-text-neutral-secondary border-stroke-neutral-dark w-fit rounded-[0.4rem] border px-[0.5rem] py-[0.2rem]'>
        지도 보기
      </button>
    </div>
  );
};

export default ShowMapButton;
