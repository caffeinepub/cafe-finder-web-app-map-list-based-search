import { Coffee, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EmptyStateProps {
  keyword?: string;
  city?: string;
  area?: string;
}

export default function EmptyState({ keyword, city, area }: EmptyStateProps) {
  // If no search parameters at all, show guidance
  if (!keyword && !city && !area) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <Search className="h-5 w-5" />
        <AlertTitle>Start Your Search</AlertTitle>
        <AlertDescription>
          Enter a cafe name, city, or area above to find cafes.
        </AlertDescription>
      </Alert>
    );
  }

  // Build search description for no results message
  const searchParts: string[] = [];
  if (keyword) searchParts.push(`"${keyword}"`);
  if (city) searchParts.push(`in city: ${city}`);
  if (area) searchParts.push(`in area: ${area}`);
  const searchDescription = searchParts.join(' ');

  return (
    <Alert className="max-w-2xl mx-auto">
      <Coffee className="h-5 w-5" />
      <AlertTitle>No Cafes Found</AlertTitle>
      <AlertDescription>
        We couldn't find any cafes matching {searchDescription}. Try adjusting your search terms or exploring a different location.
      </AlertDescription>
    </Alert>
  );
}
