'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface PricingPlan {
  name: string;
  badge: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

interface Pricing4Props {
  title?: string;
  description?: string;
  plans?: PricingPlan[];
  className?: string;
}

const Pricing4 = ({
  title = 'Pricing',
  description = 'Start managing inventory across your businesses today. No hidden fees.',
  plans = [
    {
      name: 'Starter',
      badge: 'Starter',
      monthlyPrice: '$49',
      yearlyPrice: '$490',
      features: [
        'Up to 2 companies',
        '5,000 SKUs',
        'Basic inventory tracking',
        'Email support',
        'Mobile app access',
      ],
      buttonText: 'Start Free Trial',
    },
    {
      name: 'Business',
      badge: 'Business',
      monthlyPrice: '$99',
      yearlyPrice: '$990',
      features: [
        'Up to 10 companies',
        '50,000 SKUs',
        'Advanced reporting & analytics',
        'Multi‑warehouse support',
        'Priority email & chat support',
      ],
      buttonText: 'Start Free Trial',
      isPopular: true,
    },
    {
      name: 'Enterprise',
      badge: 'Enterprise',
      monthlyPrice: '$249',
      yearlyPrice: '$2,490',
      features: [
        'Unlimited companies',
        'Unlimited SKUs',
        'Custom branding & white-label',
        'Dedicated account manager',
        'API access & SSO',
        '24/7 phone support',
      ],
      buttonText: 'Contact Sales',
    },
  ],
  className,
}: Pricing4Props) => {
  const [isAnnually, setIsAnnually] = useState(false);
  return (
    <section className={cn('py-32', className)}>
      <div className="container mx-auto">
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl font-semibold text-pretty lg:text-6xl">{title}</h2>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <p className="max-w-3xl text-muted-foreground lg:text-xl">{description}</p>
            <Tabs
              value={isAnnually ? 'annually' : 'monthly'}
              onValueChange={(value: string) => setIsAnnually(value === 'annually')}
              className="w-fit shrink-0"
              aria-label="Billing period"
            >
              <TabsList className="grid h-11 w-max grid-cols-2 gap-0 rounded-md p-1 text-lg">
                <TabsTrigger
                  value="monthly"
                  className="h-full min-h-0 px-7 py-0 font-semibold text-muted-foreground data-active:text-foreground"
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger
                  value="annually"
                  className="h-full min-h-0 px-7 py-0 font-semibold text-muted-foreground data-active:text-foreground"
                >
                  Yearly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex w-full flex-col rounded-lg border p-6 text-left ${
                  plan.isPopular ? 'bg-muted' : ''
                }`}
              >
                <Badge className="mb-8 block w-fit uppercase">{plan.badge}</Badge>
                <h3 className="font-mono text-4xl lg:text-5xl">
                  {isAnnually ? plan.yearlyPrice : plan.monthlyPrice}
                </h3>
                <p
                  className={`text-muted-foreground ${plan.monthlyPrice === '$0' ? 'invisible' : ''}`}
                >
                  {isAnnually ? 'Per year' : 'Per month'}
                </p>
                <Separator className="my-6" />
                <div className="flex h-full flex-col justify-between gap-20">
                  <ul className="space-y-4 text-muted-foreground md:leading-snug">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="size-4 shrink-0" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">{plan.buttonText}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing4 };
