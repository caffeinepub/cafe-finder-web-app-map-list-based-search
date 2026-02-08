import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Cafe } from '@/backend';

export function useCafeDetails(id: string) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Cafe>({
    queryKey: ['cafes', 'details', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      
      const cafeId = BigInt(id);
      return actor.getCafeById(cafeId);
    },
    enabled: !!actor && !isActorFetching && !!id,
    retry: false,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}
