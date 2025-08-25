import { StrictMode } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthError } from '@apis';
import ReactDOM from 'react-dom/client';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import './styles.css';
import { showToastError } from '@utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry once for non-auth errors
      retry: (failureCount, error) => {
        if (error instanceof AuthError) return false;
        return failureCount < 1;
      },
      throwOnError: true,
    },
    mutations: {
      retry: false,
      throwOnError: false,
      onError: (error: unknown) => {
        showToastError(error);
      },
    },
  },
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}
