import { DashBoardCard } from '@dashboard/components';
import { IcArrowRotateRight01 } from '@icons';
//TODO: IcBusFill, IcSubwayFill 추가
import { Button } from '@components';

const HelperDashboardSearchCard = () => {
  return (
    <DashBoardCard.Card className='h-[50rem]'>
      <div className='flex-between'>
        <h4 className='title-20-bold text-text-neutral-primary'>최적 경로</h4>
        <div className='w-[13rem]'>
          <Button variant='secondary' size='sm'>
            <div className='flex-start flex gap-[0.4rem]'>
              <IcArrowRotateRight01 className='[&_path]:fill-icon-neutral-primary h-[1.6rem] w-[1.6rem]' />
              현 위치에서 검색
            </div>
          </Button>
        </div>
      </div>
    </DashBoardCard.Card>
  );
};

export default HelperDashboardSearchCard;
