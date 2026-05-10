import CTA03 from '@/components/call-to-action';
import { Faq1 } from '@/components/faq1';
import { Feature197 } from '@/components/feature197';
import { FooterWithSocialLinks } from '@/components/footer';
import { Hero7 } from '@/components/hero7';
import { MarqueeDemo } from '@/components/marqque-demo';
import { Navbar1 } from '@/components/navbar1';
import { Pricing4 } from '@/components/pricing4';
import LogoCloudDemo from '@/components/shadcn-space/blocks/logo-cloud-01/logo-cloud';

export default function Index() {
  return (
    <>
      <Navbar1 />
      <Hero7 />
      <LogoCloudDemo />
      <Feature197 />
      <MarqueeDemo />
      <Pricing4 />
      <Faq1 />
      <CTA03 />
      <FooterWithSocialLinks />
    </>
  );
}
