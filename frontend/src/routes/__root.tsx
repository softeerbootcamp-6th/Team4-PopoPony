import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type QueryClient } from '@tanstack/react-query';
import { Landing, RootFallbackUI, ErrorSuspenseBoundary } from '@shared/ui';
import { RootLayout, PageLayout } from '@shared/ui/layout';
import { authStorage } from '@auth/utils';
import { Toaster } from 'sonner';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/login' || location.pathname.startsWith('/dashboard/map/')) {
      return;
    }
    if (!(await authStorage.getIsLoggedIn())) {
      throw redirect({
        to: '/login',
      });
    }
  },
  errorComponent: ({ error }) => (
    <RootLayout>
      <Landing />
      <PageLayout>
        <ErrorSuspenseBoundary isRoot>
          <RootFallbackUI error={error} />
        </ErrorSuspenseBoundary>
      </PageLayout>
    </RootLayout>
  ),

  component: () => (
    <>
      <RootLayout>
        <Landing />
        <PageLayout>
          <ErrorSuspenseBoundary isRoot>
            <Outlet />
            <Toaster
              position='top-center'
              style={{ position: 'absolute' }}
              duration={1000}
              richColors={true}
            />
          </ErrorSuspenseBoundary>
        </PageLayout>
      </RootLayout>
      <div className='text-[16px]'>
        <TanStackRouterDevtools />
        <ReactQueryDevtools buttonPosition='bottom-right' />
      </div>
    </>
  ),
});
