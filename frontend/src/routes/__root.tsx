import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryErrorResetBoundary, type QueryClient } from '@tanstack/react-query';
import { Landing, RootFallbackUI, SuspenseUI } from '@components';
import { RootLayout } from '@layouts';
import { authStorage } from '@auth/utils';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/login') {
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
      <RootFallbackUI error={error} />
    </RootLayout>
  ),

  component: () => (
    <>
      <RootLayout>
        <Landing />
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              resetKeys={[location.pathname]}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <RootFallbackUI
                  error={error}
                  onReset={() => {
                    reset();
                    resetErrorBoundary();
                  }}
                />
              )}>
              <Suspense fallback={<SuspenseUI />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </RootLayout>
      <div className='text-[16px]'>
        <TanStackRouterDevtools />
        <ReactQueryDevtools buttonPosition='bottom-right' />
      </div>
    </>
  ),
});
