# erfanbanaei.ir

Personal website of Erfan Banaei: portfolio, resume and the latest posts from [blog.erfanbanaei.ir](https://blog.erfanbanaei.ir). Persian at `/` (RTL), English at `/en`.

Built with Next.js 16 (App Router, React 19), Tailwind CSS 4 and shadcn/ui, deployed on Vercel.

## Development

Requires Node 20.9+.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build (type-checks and validates all content)
npm run blog:snapshot  # refresh the saved copy of the blog feed
npm run assets         # regenerate favicon, app icons and the social share image
```

To use the dev server from another machine, list its hostname or IP in `.env.development.local`: `ALLOWED_DEV_ORIGINS=203.0.113.10`.

## Content

All content is in `content/` as bilingual JSON and Markdown (Persian and English in each entry); images and files are in `public/`. Every file is validated at build time, so a malformed edit fails the build with a message naming the file and field.

| File | What |
|---|---|
| `site.json` | name, role, hero, about, socials, resume PDFs, blog URLs |
| `projects/<slug>.md` | one file per project |
| `skills.json`, `focus.json`, `experience.json`, `education.json`, `certificates.json`, `uses.json`, `testimonials.json`, `now.json` | the other sections |
| `blog-snapshot.json` | generated fallback copy of the blog feed |

Blog posts come from the WordPress RSS feed (`site.json` → `blog.feedUrl`) with featured images from the WordPress REST API, refreshed hourly.

## Deploying on Vercel

Import this repository in Vercel (the framework is detected as Next.js) and set the environment variable `SITE_URL=https://erfanbanaei.ir`. Every push to `main` deploys.
