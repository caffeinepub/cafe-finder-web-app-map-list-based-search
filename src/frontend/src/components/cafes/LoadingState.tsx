import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <Skeleton className="h-32 rounded-t-lg" />
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
