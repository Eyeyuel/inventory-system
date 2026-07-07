import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

export function DashboardCardsSkeleton() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="@container/card">
          <CardHeader>
            <Skeleton className="h-4 w-24" /> {/* CardDescription */}
            <Skeleton className="h-8 w-32 mt-2" /> {/* CardTitle (value) */}
            <Skeleton className="h-5 w-16 mt-2" /> {/* Badge placeholder */}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <Skeleton className="h-4 w-full" /> {/* First footer line */}
            <Skeleton className="h-3 w-3/4" /> {/* Second footer line */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function DashboardCardsError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'Failed to load dashboard stats';
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
