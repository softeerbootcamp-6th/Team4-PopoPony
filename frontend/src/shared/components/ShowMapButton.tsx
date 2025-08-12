interface ShowMapButtonProps {
  roadAddress?: string;
  businessAddress: string;
}

const ShowMapButton = ({ roadAddress, businessAddress }: ShowMapButtonProps) => {
  return (
    <div className='flex-wrap gap-[0.4rem]'>
      <span className='body2-14-medium text-text-neutral-secondary mr-[0.4rem]'>{`${roadAddress ? `${roadAddress} ,` : ''} ${businessAddress}`}</span>
      <button className='caption2-10-medium text-text-neutral-secondary border-stroke-neutral-dark w-fit translate-y-[-0.1rem] rounded-[0.4rem] border px-[0.5rem] py-[0.2rem]'>
        지도 보기
      </button>
    </div>
  );
};

export default ShowMapButton;
