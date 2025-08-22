// import { createFileRoute } from '@tanstack/react-router';
// import PageLayoutFallbackUI from '@components/catchThrow/PageLayoutFallbackUI';
// import { FileRouteOptions } from '@tanstack/react-router';

// type AnyRouteOptions = Record<string, unknown> & {
//   errorComponent?: (props: { error: unknown; reset: () => void }) => React.ReactNode;
// };

// export const withPageLayoutErrorBoundary = <T extends AnyRouteOptions>(options: T): T => {
//   if (options.errorComponent) return options;
//   return {
//     ...options,
//     errorComponent: ({ error, reset }) => (
//       <PageLayoutFallbackUI
//         error={error instanceof Error ? error : new Error(String(error))}
//         resetErrorBoundary={reset}
//       />
//     ),
//   } as T;
// };

// export const createFileRouteWithBoundary = <Path extends string>(path: Path) => {
//   const base = createFileRoute(path);
//   return <T extends AnyRouteOptions>(options: T) => base(withPageLayoutErrorBoundary(options));
// };
