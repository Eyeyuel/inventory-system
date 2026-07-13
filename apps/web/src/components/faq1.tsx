import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  className?: string;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
  className?: string;
}

const Faq1 = ({
  heading = 'Frequently asked questions',
  items = [
    {
      id: 'faq-1',
      question: 'What is multi‑tenant inventory management?',
      answer:
        "It's a system that lets multiple companies manage their own inventory, orders, and suppliers within a single platform, each with isolated data and settings.",
    },
    {
      id: 'faq-2',
      question: 'How does tenant isolation work?',
      answer:
        "Every company gets its own secure workspace. Data, users, and configurations are completely separated, so no tenant can see another's information.",
    },
    {
      id: 'faq-3',
      question: 'Can I switch between companies easily?',
      answer:
        'Yes, you can toggle between tenants from the sidebar or profile menu without logging out — ideal for accountants or managers overseeing multiple businesses.',
    },
    {
      id: 'faq-4',
      question: 'What features are included?',
      answer:
        'Stock tracking, order management, supplier databases, barcode scanning, low‑stock alerts, and real‑time reports. Different plans offer different limits on SKUs and companies.',
    },
    {
      id: 'faq-5',
      question: 'Is my data safe?',
      answer:
        'Absolutely. We use encryption at rest and in transit, role‑based access control, and regular backups. Enterprise plans can also bring their own SSO.',
    },
    {
      id: 'faq-6',
      question: 'How do I get started?',
      answer:
        'Sign up for a free trial. You can add your first company in minutes. We provide onboarding guides and a sample dataset to help you explore the platform.',
    },
    {
      id: 'faq-7',
      question: 'Can I upgrade or downgrade my plan later?',
      answer:
        'Yes, you can change plans at any time. Upgrades take effect immediately; downgrades apply at the end of your billing cycle. No penalties or hidden fees.',
    },
  ],
  className,
}: Faq1Props) => {
  return (
    <section className={cn('py-32', className)}>
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl">{heading}</h1>
          <Accordion type="single" collapsible>
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export { Faq1 };
