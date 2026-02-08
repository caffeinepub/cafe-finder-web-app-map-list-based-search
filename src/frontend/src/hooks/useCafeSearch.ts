import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Cafe } from '@/backend';

export function useCafeSearch(keyword: string, city: string | null, area: string | null) {
  const { actor, isFetching: isActorFetching } = useActor();

  // Check if at least one search parameter is provided
  const hasSearchParams = keyword.trim() || city?.trim() || area?.trim();

  return useQuery<Cafe[]>({
    queryKey: ['cafes', 'search', keyword, city, area],
    queryFn: async () => {
      if (!actor) return [];
      
      // If no search parameters, return empty array
      if (!hasSearchParams) return [];
      
      return actor.searchCafes(
        keyword || '',
        city && city.trim() ? city : null,
        area && area.trim() ? area : null
      );
    },
    enabled: !!actor && !isActorFetching && !!hasSearchParams,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
