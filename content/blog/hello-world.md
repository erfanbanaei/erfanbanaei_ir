---
title:
  fa: سلام دنیا؛ خوش آمدید به وب‌سایت جدیدم
  en: Hello, world. Welcome to my new website
description:
  fa: چرا این سایت را ساختم و چطور محتوایش را فقط با یک ربات تلگرام مدیریت می‌کنم.
  en: Why I built this site, and how I manage all of its content from a Telegram bot.
date: "2026-09-23"
updated: ""
tags:
  fa: [اخبار, وب]
  en: [news, web]
cover: ""
draft: false
---
<!-- fa -->
این وب‌سایت خانهٔ جدید من است: نمونه‌کارها، رزومه و وبلاگ، همه در یک جا و به دو زبان فارسی و انگلیسی.

## چطور ساخته شده؟

سایت کاملاً **استاتیک** است و روی GitHub Pages میزبانی می‌شود. تمام محتوا به‌صورت فایل‌های Markdown و JSON داخل مخزن گیت نگهداری می‌شود و موقع build به HTML تبدیل می‌شود.

## مدیریت با ربات تلگرام

بخش جالب ماجرا این است که برای افزودن پروژه، نوشتن مقاله یا به‌روزرسانی رزومه، لازم نیست به کد دست بزنم:

1. به ربات تلگرامم پیام می‌دهم.
2. ربات تغییرات را در مخزن GitHub کامیت می‌کند.
3. ‏GitHub Actions سایت را دوباره می‌سازد و منتشر می‌کند.

هر تغییر یک کامیت است، پس هر چیزی را می‌شود با یک دستور برگرداند.

به‌زودی دربارهٔ Flutter، معماری تمیز و تجربه‌هایم بیشتر می‌نویسم. ممنون که سر زدید!

<!-- en -->
This website is my new home on the web: portfolio, resume and blog in one place, in both Persian and English.

## How it's built

The site is fully **static** and hosted on GitHub Pages. All content lives in the Git repository as Markdown and JSON files and is turned into plain HTML at build time.

## Managed from Telegram

The fun part: to add a project, write an article or update my resume, I don't touch the code at all:

1. I message my Telegram bot.
2. The bot commits the change to the GitHub repository.
3. GitHub Actions rebuilds and deploys the site.

Every change is a commit, so anything can be undone with a single command.

I'll be writing more about Flutter, clean architecture and what I learn along the way. Thanks for stopping by!
