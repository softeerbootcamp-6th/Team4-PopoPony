import { useRouter } from '@tanstack/react-router';
import { IcArrowLeft } from '@icons';

type HeaderProps = {
  showBack?: boolean;
  showUpdateBefore?: boolean;
  updateBefore?: string;
};

const Header = ({ showBack = true, showUpdateBefore = true, updateBefore }: HeaderProps) => {
  const router = useRouter();

  return (
    <>
      {showBack && (
        <button
          className='bg-background-default-white shadow-button absolute top-[1.2rem] left-[1.2rem] z-30 flex h-[4.8rem] w-[4.8rem] items-center justify-center rounded-full'
          onClick={() => router.history.back()}>
          <IcArrowLeft className='h-[2.4rem] w-[2.4rem]' />
        </button>
      )}
      {showUpdateBefore && updateBefore && (
        <div className='flex-center caption1-12-medium absolute top-[2.6rem] right-[1.2rem] z-30 rounded-[0.2rem] bg-[#1C1E220F] px-[0.4rem] py-[0.2rem] text-[#1C1E2299] backdrop-blur-[0.6rem]'>
          {updateBefore} 전 업데이트
        </div>
      )}
    </>
  );
};

export default Header;
