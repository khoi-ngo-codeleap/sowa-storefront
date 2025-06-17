# JTL Cloud Ecosystem API Interaction Guidelines

This document outlines our standardized approach to API interactions across all JTL Cloud Ecosystem frontend projects. It builds upon our existing implementation using TanStack Query (React Query) and provides consistent patterns for all API-related operations.

## Core Principles

1. **Centralized**: All API interactions should follow the same core patterns
2. **Type-safe**: All API interactions should leverage TypeScript for maximum safety
3. **Error Handling**: Consistent error handling with appropriate feedback to users
4. **Performance**: Optimized data fetching with proper caching strategies
5. **Maintainable**: Clear separation between data fetching, state management, and UI

## Architecture Overview

Our API interaction architecture consists of:

1. **API Clients**: Base axios/supabase clients for HTTP/DB interactions
2. **Data Queries**: TanStack Query hooks for fetching data (GET requests)
3. **Data Commands**: TanStack Mutation hooks for modifying data (POST/PUT/DELETE)
4. **Error Handling**: Centralized error processing with Sentry reporting
5. **Shared Types**: Common types for responses, errors, and domain models

## 1. Data Queries (GET Requests)

### Implementation Pattern

```typescript
// 1. Define query keys and options in domain/queries/{feature}Queries.ts
export const featureQueries = {
  all: ["feature-name"], // Base key for the domain
  list: (filters?: FeatureFilters) =>
    queryOptions({
      queryKey: [...featureQueries.all, filters],
      queryFn: () => getFeatureList(filters ?? {}),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...featureQueries.all, id],
      queryFn: () => getFeatureById({ id }),
    }),
};

// 2. Use TanStack's useQuery in components
const { data, error, isLoading } = useQuery(featureQueries.detail(id));
```

### Error Handling for Queries

All API query implementations should use our QueryErrorBoundary component:

```tsx
<QueryErrorBoundary>
  <FeatureDetailContent />
</QueryErrorBoundary>
```

This boundary will:
- Handle 404 errors with appropriate "Not Found" UI
- Handle 401/403 errors with authentication redirects
- Send 500 errors to Sentry
- Display appropriate feedback to users

## 2. Data Commands (POST/PUT/DELETE)

### Implementation Pattern

```typescript
// Define command hook in domain/command/use{Action}{Entity}.ts
export default function useUpdateFeature() {
  const toast = useToast();
  
  return useMutation({
    meta: {
      successMsg: "Feature has been updated successfully",
      errorMsg: "Failed to update feature",
    },
    mutationFn: updateFeature,
    onSuccess: (_data, _variables) => {
      toast.success("Feature updated successfully");
      return queryClient.invalidateQueries({
        queryKey: featureQueries.all,
      });
    },
    onError: (error) => {
      handleApiError(error);
    }
  });
}
```

### Error Handling for Commands

- 400-level errors should display validation feedback to the user
- 500-level errors should be sent to Sentry and display a generic error message
- Network errors should prompt a retry option

## 3. Centralized Error Handler

Create a utility that processes all API errors consistently:

```typescript
// apis/errorHandler.ts
export function handleApiError(error: unknown): void {
  // For server errors, send to Sentry
  if (isServerError(error)) {
    Sentry.captureException(error);
  }
  
  // Show appropriate UI feedback based on error type
  if (isValidationError(error)) {
    // Handle validation errors (typically 400)
    showValidationFeedback(error);
  } else if (isAuthError(error)) {
    // Handle auth errors (401/403) 
    redirectToLogin();
  } else if (isNotFoundError(error)) {
    // Handle 404 errors
    showNotFoundMessage();
  } else {
    // Generic error handling
    showErrorFeedback();
  }
}
```

## 4. API Client Configuration

Our base API clients should be configured consistently:

```typescript
// apis/client.ts
import axios from "axios";
import * as Sentry from "@sentry/react";

const API_URL = process.env.API_URL || 'https://api.dev.jtl-cloud.com';

// Create axios instance with default config
const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptors for auth tokens
client.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptors for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status >= 500) {
      Sentry.captureException(error);
    }
    return Promise.reject(error);
  }
);

export default client;
```

## 5. Loading States

Standardize loading state handling:

```tsx
// Common loading state pattern
const { data, isLoading, error } = useQuery(featureQueries.list(filters));

// In component
return (
  <>
    {isLoading ? (
      <LoadingSpinner />
    ) : error ? (
      <ErrorDisplay error={error} />
    ) : (
      <DataDisplay data={data} />
    )}
  </>
);
```

## 6. Query Invalidation

Maintain consistent cache invalidation patterns:

```typescript
// After mutation, invalidate affected queries
queryClient.invalidateQueries({
  queryKey: featureQueries.all, // Invalidate all queries in this domain
});

// For more targeted invalidation
queryClient.invalidateQueries({
  queryKey: [...featureQueries.all, entityId], // Only invalidate specific entity
});
```

## 7. Best Practices

1. **Use query keys consistently** - Follow hierarchical patterns (entity, id, related data)
2. **Set appropriate staleTime/cacheTime** - Configure based on data volatility
3. **Prefetch data when possible** - Use `prefetchQuery` for anticipated user journeys
4. **Handle loading states gracefully** - Show skeletons instead of spinners when possible
5. **Transform API responses** - Map backend models to frontend models when needed
6. **Separate API layer from UI** - Keep API logic in dedicated hooks/services

## Implementation Checklist

- [ ] Ensure all API clients follow base configuration
- [ ] Implement central error handling utility
- [ ] Add Sentry integration for 5xx errors
- [ ] Create QueryErrorBoundary component
- [ ] Update existing queries to use standardized patterns
- [ ] Update existing commands to use standardized patterns
- [ ] Add proper TypeScript interfaces for all API interactions

## Related Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Axios Documentation](https://axios-http.com/docs/intro)
