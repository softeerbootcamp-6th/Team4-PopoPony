import { createFileRoute, Outlet } from '@tanstack/react-router';
import { TopAppBar } from '@components';

export const Route = createFileRoute('/components')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <main className='mt-[6rem]'>
        <Outlet />
      </main>
    </>
  );
}
