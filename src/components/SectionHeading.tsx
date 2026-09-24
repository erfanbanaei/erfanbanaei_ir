import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  link?: { href: string; label: string; external?: boolean };
};

export function SectionHeading({ id, title, eyebrow, description, link }: Props) {
  const linkClass = 'group inline-flex items-center gap-1.5 text-sm font-medium text-brand';
  const arrow = (
    <ArrowRight
      className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
      aria-hidden
    />
  );
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4" data-reveal>
      <div className="max-w-2xl space-y-3">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description && <p className="text-lg text-pretty text-muted-foreground">{description}</p>}
      </div>
      {link &&
        (link.external ? (
          <a href={link.href} className={linkClass}>
            {link.label}
            {arrow}
          </a>
        ) : (
          <Link href={link.href} className={linkClass}>
            {link.label}
            {arrow}
          </Link>
        ))}
    </div>
  );
}
