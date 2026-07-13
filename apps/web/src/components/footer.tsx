'use client';
import { Button } from '@/components/ui/button';
import {
  DribbbleLogoIcon,
  FacebookLogoIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from '@phosphor-icons/react';

const LINKS = [
  {
    title: 'Product',
    items: [
      { title: 'Features', href: '#' },
      { title: 'Pricing', href: '#' },
      { title: 'Integrations', href: '#' },
      { title: 'API', href: '#' },
    ],
  },
  {
    title: 'Company',
    items: [
      { title: 'About Us', href: '#' },
      { title: 'Careers', href: '#' },
      { title: 'Partners', href: '#' },
      { title: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { title: 'Help Center', href: '#' },
      { title: 'Documentation', href: '#' },
      { title: 'Blog', href: '#' },
      { title: 'System Status', href: '#' },
    ],
  },
];

const YEAR = new Date().getFullYear();

export function FooterWithSocialLinks() {
  return (
    <footer className="relative w-full">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <h6 className="mb-4 text-lg font-semibold">InvenTrak</h6>
          <div className="grid grid-cols-3 justify-between gap-x-6 gap-y-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <p className="mb-2 font-semibold opacity-50">{title}</p>
                {items.map(({ title, href }) => (
                  <li key={title}>
                    <a href={href} className="hover:text-primary block py-1 transition-colors">
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="border-border mt-10 flex w-full flex-col items-center justify-center gap-4 border-t py-4 md:flex-row md:justify-between">
          <p className="text-center text-sm">
            &copy; {YEAR}{' '}
            <a href="#" className="hover:text-primary">
              InvenTrak
            </a>
            . All Rights Reserved.
          </p>
          <div className="flex gap-1 sm:justify-center">
            <Button variant="ghost" size="icon" asChild>
              <a href="#">
                <FacebookLogoIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#">
                <InstagramLogoIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#">
                <TwitterLogoIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#">
                <GithubLogoIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#">
                <DribbbleLogoIcon className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
