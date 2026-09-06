import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Do not retry on client errors (400, 401, 403, 404, 422)
        if (error?.status && [400, 401, 403, 404, 422].includes(error.status)) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
