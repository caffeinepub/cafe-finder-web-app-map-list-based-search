import { Coffee, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EmptyStateProps {
  keyword?: string;
  city?: string;
}

export default function EmptyState({ keyword, city }: EmptyStateProps) {
  if (!keyword) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <Search className="h-5 w-5" />
        <AlertTitle>Start Your Search</AlertTitle>
        <AlertDescription>
          Enter a cafe name or keyword above to find cafes in your area.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="max-w-2xl mx-auto">
      <Coffee className="h-5 w-5" />
      <AlertTitle>No Cafes Found</AlertTitle>
      <AlertDescription>
        We couldn't find any cafes matching "{keyword}"
        {city && ` in ${city}`}. Try adjusting your search terms or exploring a different area.
      </AlertDescription>
    </Alert>
  );
}
