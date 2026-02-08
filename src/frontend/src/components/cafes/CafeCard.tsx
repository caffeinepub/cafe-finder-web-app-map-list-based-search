import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { Cafe } from '@/backend';

interface CafeCardProps {
  cafe: Cafe;
  isSelected?: boolean;
  onSelect?: (cafeId: string) => void;
}

export default function CafeCard({ cafe, isSelected = false, onSelect }: CafeCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(cafe.id.toString());
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: '/cafes/$id', params: { id: cafe.id.toString() } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${isSelected ? 'Selected: ' : ''}View ${cafe.name}`}
    >
      <div
        className={`bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 h-32 rounded-t-lg transition-all ${
          isSelected ? 'from-amber-200 to-orange-200 dark:from-amber-800/30 dark:to-orange-800/30' : ''
        }`}
      />
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start justify-between gap-2">
          <span className="line-clamp-2">{cafe.name}</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-0.5" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{cafe.address}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {cafe.city.name}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {cafe.area.name}
          </Badge>
        </div>

        {onSelect && (
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-2"
            onClick={handleViewDetails}
          >
            <ExternalLink className="mr-2 h-3 w-3" />
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
