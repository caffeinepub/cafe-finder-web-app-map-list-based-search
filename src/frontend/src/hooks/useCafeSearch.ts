import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Cafe } from '@/backend';

export function useCafeSearch(keyword: string, city: string | null) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Cafe[]>({
    queryKey: ['cafes', 'search', keyword, city],
    queryFn: async () => {
      if (!actor) return [];
      
      // If no keyword, return empty array (don't search)
      if (!keyword.trim()) return [];
      
      return actor.searchCafes(keyword, city || null, null);
    },
    enabled: !!actor && !isActorFetching && !!keyword.trim(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
