import React from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
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
          fallbackRender={({ error, resetErrorBoundary }) =>
            isRoot ? (
              <RootFallbackUI
                error={error}
                onReset={() => {
                  reset();
                  resetErrorBoundary();
                }}
              />
            ) : (
              <FallbackUI
                error={error}
                onReset={() => {
                  reset();
                  resetErrorBoundary();
                }}
              />
            )
          }>
          <Suspense fallback={<SuspenseUI />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default ErrorSuspenseBoundary;
