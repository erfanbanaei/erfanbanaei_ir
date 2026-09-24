import 'server-only';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// Content is written by the site owner (directly or via the bot), so raw HTML in it is not allowed
// through: remark-rehype drops it by default.
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify);

export async function renderMarkdown(source: string) {
  if (!source.trim()) return '';
  return String(await processor.process(source));
}
