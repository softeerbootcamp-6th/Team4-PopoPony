import React, { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { SuspenseUI, FallbackUI, RootFallbackUI } from '@components';

type Props = {
  children: React.ReactNode;
  isRoot?: boolean;
};

const ErrorSuspenseBoundary = ({ children, isRoot = false }: Props) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          resetKeys={isRoot ? [location.pathname] : undefined}
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => {
            const handleReset = () => {
              reset();
              resetErrorBoundary();
            };

            return isRoot ? (
              <RootFallbackUI error={error} onReset={handleReset} />
            ) : (
              <FallbackUI error={error} onReset={handleReset} />
            );
          }}>
          <Suspense fallback={<SuspenseUI />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default ErrorSuspenseBoundary;
