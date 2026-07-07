import { Package, ArrowRightLeft, FilePen, ShoppingCart } from 'lucide-react';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/services/client/dashboard';

interface SectionCardsProps {
  state: DashboardStats | undefined;
}

export function SectionCards({ state }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total Products */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {state?.totalProducts.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Active SKUs in inventory</div>
          <div className="text-muted-foreground">Updated just now</div>
        </CardFooter>
      </Card>

      {/* Stock Movements */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Stock Movements</p>
            <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {state?.stockMovements.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Total adjustments & transfers</div>
          <div className="text-muted-foreground">Since last month</div>
        </CardFooter>
      </Card>

      {/* Sales Drafts */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Sales Drafts</p>
            <FilePen className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {state?.salesDrafts.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Pending sales orders</div>
          <div className="text-muted-foreground">Awaiting confirmation</div>
        </CardFooter>
      </Card>

      {/* Purchase Drafts */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Purchase Drafts</p>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {state?.purchaseDrafts.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Pending purchase orders</div>
          <div className="text-muted-foreground">Awaiting approval</div>
        </CardFooter>
      </Card>
    </div>
  );
}

// import { TrendingDown, TrendingUp } from 'lucide-react';

// import { Badge } from '@/components/ui/badge';
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { DashboardStats } from '@/services/client/dashboard';

// interface SectionCardsProps {
//   state: DashboardStats | undefined;
// }

// export function SectionCards({ state }: SectionCardsProps) {
//   return (
//     <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Total Products</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             {state?.totalProducts.toLocaleString()}
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <TrendingUp />
//               +12.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Trending up this month <TrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">Visitors for the last 6 months</div>
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Stock Movements</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             {state?.stockMovements.toLocaleString()}
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <TrendingDown />
//               -20%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Down 20% this period <TrendingDown className="size-4" />
//           </div>
//           <div className="text-muted-foreground">Acquisition needs attention</div>
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Sales Drafts</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             {state?.salesDrafts.toLocaleString()}
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <TrendingUp />
//               +12.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Strong user retention <TrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">Engagement exceed targets</div>
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Purchase Drafts</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             {state?.purchaseDrafts.toLocaleString()}
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <TrendingUp />
//               +4.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Steady performance increase <TrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">Meets growth projections</div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
