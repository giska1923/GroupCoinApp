import React from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

interface QueryViewProps<T> {
  query: UseQueryResult<T>;
  children: (data: T) => React.ReactNode;
  /** Determines whether loaded data should render the empty state. */
  isEmpty?: (data: T) => boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: { label: string; onPress: () => void };
}

/**
 * Renders one of: first-load spinner, error state, empty state, or the data.
 * Background refetches never blank the screen (data stays visible).
 */
export function QueryView<T>({
  query,
  children,
  isEmpty,
  emptyTitle = 'Nothing here yet',
  emptyMessage,
  emptyIcon,
  emptyAction,
}: QueryViewProps<T>) {
  const { data, isLoading, isError, error, refetch } = query;

  if (isLoading) {
    return <Spinner fill />;
  }

  if (isError && data === undefined) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  if (data !== undefined) {
    if (isEmpty?.(data)) {
      return (
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          icon={emptyIcon}
          action={emptyAction}
        />
      );
    }
    return <>{children(data)}</>;
  }

  return null;
}
