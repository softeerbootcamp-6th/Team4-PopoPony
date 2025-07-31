import { createFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Button } from '@components';

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
      <PageLayout.Footer>
        <Button variant='primary' onClick={() => alert('Single 버튼 클릭됨')}>
          확인
        </Button>
      </PageLayout.Footer>
    </PageLayout>
  );
}
