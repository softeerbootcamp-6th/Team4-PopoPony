import { useNavigate } from '@tanstack/react-router';

interface ShowMapButtonProps {
  roadAddress?: string;
  businessAddress: string;
  pos: { lat: number; lng: number };
  fontSize?: 'small' | 'medium';
}

const ShowMapButton = ({
  roadAddress,
  businessAddress,
  pos,
  fontSize = 'small',
}: ShowMapButtonProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate({
      to: '/map',
      search: {
        lat: pos.lat,
        lng: pos.lng,
      },
    });
  };

  return (
    <>
      <div className='flex-wrap gap-[0.8rem]'>
        <span
          className={`${fontSize === 'small' ? 'body2-14-medium' : 'body1-16-medium'} text-text-neutral-secondary mr-[0.4rem]`}>{`${roadAddress ? `${roadAddress} ,` : ''} ${businessAddress}`}</span>
        <button
          className='caption2-10-medium text-text-neutral-secondary border-stroke-neutral-dark w-fit translate-y-[-0.1rem] rounded-[0.4rem] border px-[0.5rem] py-[0.2rem]'
          onClick={handleClick}>
          지도 보기
        </button>
      </div>
    </>
  );
};

export default ShowMapButton;
