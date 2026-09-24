import Image from 'next/image';
import { ArrowUpRight, BookOpen } from 'lucide-react';

import type { BlogPost } from '@/lib/blog';
import { formatDate, type Lang } from '@/lib/i18n';
import type { Dictionary } from '@/i18n/dictionaries';
import { cn } from '@/lib/utils';

type Props = {
  post: BlogPost;
  lang: Lang;
  t: Dictionary;
  headingLevel?: 'h2' | 'h3';
  variant?: 'default' | 'feature';
  sizes?: string;
  priority?: boolean;
};

/** A card for an article on the external blog. Posts are Persian, so the card body is always RTL. */
export function PostCard({ post, lang, t, headingLevel: H = 'h3', variant = 'default', sizes, priority }: Props) {
  const feature = variant === 'feature';
  return (
    <article
      className={cn('group surface surface-hover relative flex h-full overflow-hidden', feature ? 'flex-col lg:flex-row' : 'flex-col')}
      data-categories={JSON.stringify(post.categories)}
    >
      <div className={cn('relative shrink-0 overflow-hidden bg-muted', feature ? 'aspect-[16/9] lg:aspect-auto lg:w-[55%]' : 'aspect-[16/9] border-b')}>
        {post.image ? (
          <Image
            src={post.image.src}
            alt={post.image.alt || post.title}
            fill
            sizes={sizes ?? (feature ? '(min-width: 1024px) 620px, 100vw' : '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw')}
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="bg-aurora absolute inset-0 grid place-items-center">
            <BookOpen className="size-10 text-brand/60" aria-hidden />
          </div>
        )}
      </div>
      <div className={cn('flex flex-1 flex-col gap-3', feature ? 'p-6 lg:p-8' : 'p-5')} dir="rtl" lang="fa">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {post.date && <time dateTime={post.date}>{formatDate('fa', post.date)}</time>}
          {post.categories.slice(0, 2).map((c) => (
            <span key={c} className="rounded-full bg-primary/10 px-2 py-0.5 text-brand">
              {c}
            </span>
          ))}
        </div>
        <H className={cn('leading-snug font-semibold text-balance', feature ? 'text-2xl lg:text-3xl' : 'text-lg')}>
          <a href={post.url} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </a>
        </H>
        {post.excerpt && <p className={cn('text-sm leading-7 text-muted-foreground', feature ? 'line-clamp-4' : 'line-clamp-3')}>{post.excerpt}</p>}
        <p className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-brand" dir={lang === 'fa' ? 'rtl' : 'ltr'} lang={lang}>
          {t.blog.read}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden />
        </p>
      </div>
    </article>
  );
}
