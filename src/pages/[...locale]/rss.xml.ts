import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, getSite } from '@/lib/content';
import { langFromParam, localeStaticPaths, localize, useTranslations } from '@/i18n/utils';

export const getStaticPaths = localeStaticPaths;

export async function GET(context: APIContext) {
  const lang = langFromParam(context.params.locale);
  const t = useTranslations(lang);
  const site = await getSite();
  const posts = await getPosts();
  return rss({
    title: `${site.name[lang]} | ${t('blog.title')}`,
    description: t('blog.description'),
    site: new URL(localize(lang, '/'), context.site).href,
    trailingSlash: true,
    customData: `<language>${lang === 'fa' ? 'fa-ir' : 'en-us'}</language>`,
    items: posts.map((post) => ({
      title: post.data.title[lang],
      description: post.data.description[lang],
      pubDate: new Date(`${post.data.date}T00:00:00Z`),
      link: localize(lang, `/blog/${post.id}/`),
      categories: post.data.tags[lang],
      content: post.data.html[lang],
    })),
  });
}
