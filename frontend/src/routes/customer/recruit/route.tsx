import { createFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { TopAppBar } from '@components';
export const Route = createFileRoute('/customer/recruit')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <TopAppBar title='동행 신청하기' showBack={true} showClose={true} background={true} />
      <main className='mt-[6rem]'>
        <Outlet />
      </main>
    </>
  );
}
