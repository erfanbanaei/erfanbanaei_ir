import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Mail } from 'lucide-react';

import { ContactForm } from '@/components/ContactForm';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { SocialIcon } from '@/components/SocialIcon';
import { getSite } from '@/lib/content';
import { href, isLang } from '@/lib/i18n';
import { absolute, breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: '/contact', title: t.contact.title, description: t.contact.description, site: await getSite() });
}

function handle(url: string) {
  try {
    const u = new URL(url);
    const last = u.pathname.replace(/\/$/, '').split('/').filter(Boolean).pop() ?? u.hostname;
    return last.startsWith('@') ? last : `@${last}`;
  } catch {
    return url;
  }
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const site = await getSite();

  return (
    <>
      <JsonLd
        data={[
          { '@context': 'https://schema.org', '@type': 'ContactPage', name: t.contact.title, url: absolute(href(lang, '/contact')) },
          breadcrumbSchema([
            { name: t.nav.home, path: href(lang, '/') },
            { name: t.contact.title, path: href(lang, '/contact') },
          ]),
        ]}
      />
      <PageHeader title={t.contact.title} description={t.contact.description} />
      <div className="container-page grid gap-10 py-8 lg:grid-cols-[1fr_22rem]">
        <section className="surface p-6 sm:p-9" aria-labelledby="form-heading">
          <h2 id="form-heading" className="mb-7 text-xl font-semibold">
            {t.contact.formTitle}
          </h2>
          <ContactForm
            accessKey={site.integrations.web3formsKey}
            email={site.email}
            labels={{
              name: t.contact.name,
              email: t.contact.email,
              subject: t.contact.subject,
              message: t.contact.message,
              send: t.contact.send,
              sending: t.contact.sending,
              success: t.contact.success,
              error: t.contact.error,
              mailtoNote: t.contact.mailtoNote,
            }}
          />
        </section>

        <aside className="space-y-8">
          <section aria-labelledby="direct-heading">
            <h2 id="direct-heading" className="mb-4 text-sm font-semibold text-muted-foreground">
              {t.contact.direct}
            </h2>
            <a href={`mailto:${site.email}`} className="group surface surface-hover flex items-center gap-4 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-brand-2/15 text-brand">
                <Mail className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">{t.contact.emailMe}</span>
                <span className="block truncate font-medium group-hover:text-brand" dir="ltr">
                  {site.email}
                </span>
              </span>
            </a>
          </section>
          <section aria-labelledby="social-heading">
            <h2 id="social-heading" className="mb-4 text-sm font-semibold text-muted-foreground">
              {t.contact.social}
            </h2>
            <ul className="surface divide-y overflow-hidden">
              {site.socials.map((s) => (
                <li key={s.id + s.url}>
                  <a href={s.url} target="_blank" rel="me noopener noreferrer" className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent">
                    <SocialIcon id={s.id} className="size-[1.1rem] text-muted-foreground group-hover:text-foreground" />
                    <span className="flex-1 text-sm">{s.label[lang]}</span>
                    <span className="text-xs text-muted-foreground" dir="ltr">
                      {handle(s.url)}
                    </span>
                    <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 rtl:-scale-x-100" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
