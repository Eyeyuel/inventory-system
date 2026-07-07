import { Star } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Hero7Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
    className?: string;
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
  className?: string;
}

const Hero7 = ({
  heading = 'Multi‑Tenant Inventory Management, Simplified',
  description = 'One platform to manage stock, orders, and suppliers across all your companies. Secure, scalable, and ready for your entire organization.',
  button = {
    text: 'Start Free Trial',
    url: '/signup',
  },
  reviews = {
    count: 1200,
    rating: 4.9,
    avatars: [
      {
        src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp',
        alt: 'Avatar 1',
      },
      {
        src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp',
        alt: 'Avatar 2',
      },
      {
        src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp',
        alt: 'Avatar 3',
      },
      {
        src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp',
        alt: 'Avatar 4',
      },
      {
        src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp',
        alt: 'Avatar 5',
      },
    ],
  },
  className,
}: Hero7Props) => {
  return (
    <section className={cn('py-32', className)}>
      {/* Pattern overlay */}
      {/* <div
        className="absolute inset-0 -z-10 h-full w-full bg-background
    bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]
    dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]
    bg-size-[20px_20px]"
      /> */}
      <div
        className="absolute inset-0 -z-10 h-full w-full bg-background
  bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)]
  dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]
  bg-size-[4rem_4rem]"
      />

      <div className="container text-center">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <h1 className="text-3xl font-semibold lg:text-6xl">{heading}</h1>
          <p className="text-balance text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <Button asChild size="lg" className="mt-10">
          <a href={button.url}>{button.text}</a>
        </Button>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            {reviews.avatars.map((avatar, index) => (
              <Avatar key={index} className="size-14 border">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            ))}
          </span>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="size-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="mr-1 font-semibold">{reviews.rating?.toFixed(1)}</span>
            </div>
            <p className="text-left font-medium text-muted-foreground">
              trusted by {reviews.count}+ businesses
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero7 };
