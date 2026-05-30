import { useQuery } from '@tanstack/react-query';
import { activityApi } from '../api/resources';
import { queryKeys } from '../api/queryClient';

export const useGroupActivity = (groupId: string) =>
  useQuery({
    queryKey: queryKeys.activity.group(groupId),
    queryFn: () => activityApi.listByGroup(groupId),
    enabled: !!groupId,
  });
