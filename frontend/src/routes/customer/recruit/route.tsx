import { createFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { TopAppBar, ButtonCTA } from '@components';
import { PageLayout } from '@layouts';
export const Route = createFileRoute('/customer/recruit')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout>
      <PageLayout.Header title='동행 신청하기' showBack={true} showClose={true} background={true} />
      <PageLayout.Content>
        <Outlet />
        <div className='h-[100dvh]'></div>
      </PageLayout.Content>
      <PageLayout.Footer variant='single' text='확인' onClick={() => alert('Single 버튼 클릭됨')} />
    </PageLayout>
  );
}
