import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';
import { useCafeDetails } from '@/hooks/useCafeDetails';
import { Skeleton } from '@/components/ui/skeleton';

export default function CafeDetailsPage() {
  const { id } = useParams({ from: '/cafes/$id' });
  const navigate = useNavigate();
  const { data: cafe, isLoading, error } = useCafeDetails(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-destructive mb-2">Cafe Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The cafe you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate({ to: '/' })}>Return to Search</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 h-48" />
        
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-3xl mb-2">{cafe.name}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                <MapPin className="mr-1 h-3 w-3" />
                {cafe.city.name}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {cafe.area.name}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
              Address
            </h3>
            <p className="text-muted-foreground pl-7">{cafe.address}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Navigation className="mr-2 h-5 w-5 text-muted-foreground" />
              Coordinates
            </h3>
            <p className="text-muted-foreground pl-7">
              Latitude: {cafe.coordinates[0].toFixed(6)}, Longitude: {cafe.coordinates[1].toFixed(6)}
            </p>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-3">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">City</p>
                <p className="font-medium">{cafe.city.name}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Area</p>
                <p className="font-medium">{cafe.area.name}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
