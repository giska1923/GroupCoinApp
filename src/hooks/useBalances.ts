import { useQuery } from '@tanstack/react-query';
import { balancesApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';

export const useBalances = (groupId: string) =>
  useQuery({
    queryKey: queryKeys.balances.group(groupId),
    queryFn: () => balancesApi.list(groupId),
    enabled: !!groupId,
    // Balances should always recompute on focus.
    staleTime: 0,
  });

export const useSimplifiedTransfers = (groupId: string) =>
  useQuery({
    queryKey: queryKeys.balances.simplified(groupId),
    queryFn: () => balancesApi.simplified(groupId),
    enabled: !!groupId,
    staleTime: 0,
  });
