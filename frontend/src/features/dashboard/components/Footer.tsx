import { Button } from '@shared/components';

type FooterProps = {
  escortStatus: string;
  handleClickGoToReport?: () => void;
  handleClickCallHelper?: () => void;
  handleClickGoToCustomerCenter?: () => void;
};

const Footer = ({
  escortStatus,
  handleClickGoToReport,
  handleClickCallHelper,
  handleClickGoToCustomerCenter,
}: FooterProps) => {
  if (escortStatus !== '동행완료') {
    return (
      <div className='flex w-full flex-shrink-0 gap-[0.8rem]'>
        <div className='w-[10rem]'>
          <Button variant='assistive' onClick={handleClickGoToCustomerCenter}>
            고객센터
          </Button>
        </div>
        <Button variant='secondary' className='flex-1' onClick={handleClickCallHelper}>
          도우미에게 전화걸기
        </Button>
      </div>
    );
  }
  return (
    <Button variant='primary' className='flex-1' onClick={handleClickGoToReport}>
      리포트 확인하러 가기
    </Button>
  );
};

export default Footer;
