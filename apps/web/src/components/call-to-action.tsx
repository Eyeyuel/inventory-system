import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CTA03() {
  return (
    <section className="pb-20 pt-20 md:pb-32 md:pt-32 container mx-auto">
      <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-primary/10 p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-16">
        <div className="flex-1">
          <Badge>Get Started</Badge>
          <h2 className="my-3 text-2xl font-bold tracking-tight sm:text-5xl lg:text-4xl/none">
            Manage Inventory Across All Your Companies
          </h2>
          <p className="text-xl text-muted-foreground pt-1">
            Join 1,200+ businesses that centralize stock, orders, and suppliers in one secure,
            multi‑tenant platform.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button variant="outline">Book a Demo</Button>
          <Button>Start Free Trial</Button>
        </div>
      </div>
    </section>
  );
}
