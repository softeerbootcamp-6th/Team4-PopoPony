import { type QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRouteWithContext, redirect, useRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { toast } from 'sonner';

import { useEffect } from 'react';

import { Landing } from '@/widgets/ui';

import { ErrorSuspenseBoundary, RootFallbackUI } from '@shared/ui';
import { PageLayout, RootLayout } from '@shared/ui/layout';

import { authStorage } from '@auth/utils';

const ALLOWED_ROUTES = ['/login', '/dashboard/map/', '/dashboard/error/'];

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
    if (ALLOWED_ROUTES.some((route) => location.pathname.includes(route))) {
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
