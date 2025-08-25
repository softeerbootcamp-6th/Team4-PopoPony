import { IcAlertTriangle, IcArrowRotateRight01 } from '@icons';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

import { Button } from '@shared/ui';

const Route = getRouteApi('/dashboard/error/$encryptedId');

const PatientDashboardErrorPage = () => {
  const navigate = useNavigate();
  const { encryptedId } = Route.useParams();

  return (
    <div className='flex-center from-background-light-mint to-background-default-white min-h-screen bg-gradient-to-br'>
      <div className='bg-background-default-white shadow-card flex-col-center mx-[2.4rem] w-full gap-[1.6rem] rounded-[1.2rem] px-[2.4rem] py-[3.2rem]'>
        <IcAlertTriangle className='[&_path]:fill-icon-red-primary' width={36} height={36} />
        <h1 className='title-20-bold text-text-neutral-primary'>현재 만남 중이 아닙니다</h1>
        <p className='body1-16-medium text-text-neutral-secondary text-center'>
          현재 만남 중이라면
          <br />
          새로고침하여 최신 상태를 확인해보세요.
        </p>
        <Button
          className='hover:bg-mint-60 gap-[0.8rem]'
          onClick={() => {
            navigate({
              to: '/dashboard/map/$encryptedId',
              params: {
                encryptedId: encryptedId,
              },
            });
          }}>
          <IcArrowRotateRight01 className='[&_path]:fill-white' />
          <span className='body1-16-bold text-background-default-white'>대시보드 새로고침</span>
        </Button>
      </div>
    </div>
  );
};

export default PatientDashboardErrorPage;
