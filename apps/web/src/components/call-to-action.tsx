import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CTA03() {
  return (
    <section className="pb-20 pt-20 md:pb-32 md:pt-32 container mx-auto">
      <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-primary/10 p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-16">
        <div className="flex-1">
          <Badge>CTA</Badge>
          <h2 className="my-3 text-2xl font-bold tracking-tight sm:text-5xl lg:text-4xl/none">
            Call to Action
          </h2>
          <p className="text-xl text-muted-foreground pt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat
            omnis!
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button variant="outline">Learn More</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </section>
  );
}
