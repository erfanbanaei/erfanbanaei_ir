import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import type { Loader, LoaderContext } from 'astro/loaders';

/*
 * Custom content loaders for the bilingual file format described in
 * docs/CONTENT.md. Each loader validates entries through the collection
 * schema (so a malformed file from the bot fails the build loudly) and
 * pre-renders Markdown fields for both languages.
 */

type Bilingual = { fa: string; en: string };
type RenderMd = LoaderContext['renderMarkdown'];

const contentPath = (ctx: LoaderContext, rel: string) => fileURLToPath(new URL(`content/${rel}`, ctx.config.root));

async function renderPair(render: RenderMd, value: Bilingual | undefined): Promise<Bilingual> {
  const [fa, en] = await Promise.all([
    value?.fa ? render(value.fa) : null,
    value?.en ? render(value.en) : null,
  ]);
  return { fa: fa?.html ?? '', en: en?.html ?? '' };
}

function readingMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** gray-matter turns unquoted YAML dates into Date objects; normalise them back to strings. */
function normaliseDates(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(normaliseDates);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normaliseDates(v)]));
  }
  return value;
}

/** Splits a body into its `<!-- fa -->` and `<!-- en -->` sections. */
export function splitBilingualBody(body: string, file: string): Bilingual {
  const fa = /^<!--\s*fa\s*-->[ \t]*$/m.exec(body);
  const en = /^<!--\s*en\s*-->[ \t]*$/m.exec(body);
  if (!fa || !en || en.index < fa.index) {
    throw new Error(`${file}: body must contain "<!-- fa -->" followed by "<!-- en -->" marker lines (see docs/CONTENT.md).`);
  }
  return {
    fa: body.slice(fa.index + fa[0].length, en.index).trim(),
    en: body.slice(en.index + en[0].length).trim(),
  };
}

function watch(ctx: LoaderContext, path: string, reload: () => Promise<void>) {
  if (!ctx.watcher) return;
  ctx.watcher.add(path);
  ctx.watcher.on('all', (_event, changed) => {
    if (changed.startsWith(path)) reload().catch((e) => ctx.logger.error(String(e)));
  });
}

/** A JSON file holding an array of `{ id, ... }` items. Array position is kept as `_order`. */
export function jsonArrayLoader(file: string): Loader {
  return {
    name: 'json-array-loader',
    async load(ctx) {
      const path = contentPath(ctx, file);
      const load = async () => {
        const items = JSON.parse(await readFile(path, 'utf-8'));
        if (!Array.isArray(items)) throw new Error(`content/${file} must contain a JSON array.`);
        ctx.store.clear();
        const seen = new Set<string>();
        for (const [index, item] of items.entries()) {
          const id = item?.id;
          if (typeof id !== 'string' || !id) throw new Error(`content/${file}[${index}] is missing a string "id".`);
          if (seen.has(id)) throw new Error(`content/${file}: duplicate id "${id}".`);
          seen.add(id);
          const data = await ctx.parseData({ id, data: { ...item, _order: index }, filePath: `content/${file}` });
          ctx.store.set({ id, data, digest: ctx.generateDigest(item) });
        }
      };
      await load();
      watch(ctx, path, load);
    },
  };
}

/**
 * A JSON file holding a single object. `markdownFields` are dotted paths to
 * bilingual Markdown values; their rendered HTML is stored under `html.<path>`.
 */
export function jsonSingletonLoader(file: string, markdownFields: string[] = []): Loader {
  return {
    name: 'json-singleton-loader',
    async load(ctx) {
      const path = contentPath(ctx, file);
      const id = file.replace(/\.json$/, '');
      const load = async () => {
        const raw = JSON.parse(await readFile(path, 'utf-8'));
        const html: Record<string, Bilingual> = {};
        for (const field of markdownFields) {
          const value = field.split('.').reduce<any>((obj, key) => obj?.[key], raw);
          html[field] = await renderPair(ctx.renderMarkdown, value);
        }
        const data = await ctx.parseData({ id, data: { ...raw, html }, filePath: `content/${file}` });
        ctx.store.clear();
        ctx.store.set({ id, data, digest: ctx.generateDigest(raw) });
      };
      await load();
      watch(ctx, path, load);
    },
  };
}

/** A directory of `<slug>.md` files with bilingual front matter and a two-part body. */
export function bilingualMarkdownLoader(dir: string): Loader {
  return {
    name: 'bilingual-markdown-loader',
    async load(ctx) {
      const path = contentPath(ctx, dir);
      const load = async () => {
        const files = (await readdir(path)).filter((f) => f.endsWith('.md')).sort();
        ctx.store.clear();
        for (const name of files) {
          const id = name.replace(/\.md$/, '');
          const rel = `content/${dir}/${name}`;
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
            throw new Error(`${rel}: file name must be a lowercase slug (a-z, 0-9, "-").`);
          }
          const source = await readFile(`${path}/${name}`, 'utf-8');
          const { data: frontmatter, content } = matter(source);
          const body = splitBilingualBody(content, rel);
          const html = await renderPair(ctx.renderMarkdown, body);
          const data = await ctx.parseData({
            id,
            filePath: rel,
            data: {
              ...(normaliseDates(frontmatter) as Record<string, unknown>),
              html,
              readingMinutes: { fa: readingMinutes(body.fa), en: readingMinutes(body.en) },
            },
          });
          ctx.store.set({ id, data, digest: ctx.generateDigest(source) });
        }
      };
      await load();
      watch(ctx, path, load);
    },
  };
}
