import { type QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRouteWithContext, redirect, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { Landing } from '@/widgets/ui';

import { ErrorSuspenseBoundary, RootFallbackUI } from '@shared/ui';
import { PageLayout, RootLayout } from '@shared/ui/layout';

import { authStorage } from '@auth/utils';

interface MyRouterContext {
  queryClient: QueryClient;
}
function NotFoundRedirect() {
  const router = useRouter();
  useEffect(() => {
    toast.error('존재하지 않는 경로예요. 홈으로 이동합니다.');
    router.navigate({ to: '/', replace: true });
  }, []);
  return null;
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
  notFoundComponent: () => {
    return <NotFoundRedirect />;
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
