import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { Landing } from '@components';
import RootLayout from './_layout';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/login') {
      return;
    }

    const isLoggedIn = true;
    if (!isLoggedIn) {
      throw redirect({
        to: '/login',
      });
    }
  },

  component: () => (
    <>
      <RootLayout>
        <Landing />
        <div className='h-[100dvh] min-h-[100dvh] w-full max-w-[500px] min-w-[375px]'>
          <Outlet />
        </div>
      </RootLayout>
      <div className='text-[16px]'>
        <TanStackRouterDevtools />
        <ReactQueryDevtools buttonPosition='bottom-right' />
      </div>
    </>
  ),
});
