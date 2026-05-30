import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settlementsApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';
import type { CreateSettlementPayload } from '../types/api';

export const useSettlements = (groupId: string) =>
  useQuery({
    queryKey: queryKeys.settlements.group(groupId),
    queryFn: () => settlementsApi.listByGroup(groupId),
    enabled: !!groupId,
  });

export const useCreateSettlement = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSettlementPayload) =>
      settlementsApi.create(groupId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.settlements.group(groupId) });
      qc.invalidateQueries({ queryKey: queryKeys.balances.group(groupId) });
      qc.invalidateQueries({ queryKey: queryKeys.balances.simplified(groupId) });
      qc.invalidateQueries({ queryKey: queryKeys.activity.group(groupId) });
    },
  });
};
