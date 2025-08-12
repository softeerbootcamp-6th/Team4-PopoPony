import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { Landing } from '@components';
import { RootLayout } from '@layouts';
import { isLoggedIn } from '@auth/utils';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/login') {
      return;
    }
    if (!(await isLoggedIn())) {
      throw redirect({
        to: '/login',
      });
    }
  },

  component: () => (
    <>
      <RootLayout>
        <Landing />
        <Outlet />
      </RootLayout>
      <div className='text-[16px]'>
        <TanStackRouterDevtools />
        <ReactQueryDevtools buttonPosition='bottom-right' />
      </div>
    </>
  ),
});
