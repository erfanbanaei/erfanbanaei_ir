'use client';

import { useState, type SubmitEvent } from 'react';
import { CheckCircle2, Loader2, Send, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Labels = {
  name: string;
  email: string;
  subject: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  mailtoNote: string;
};

type Status = 'idle' | 'sending' | 'success' | 'error';

/** Sends through Web3Forms when an access key is configured, otherwise opens a prefilled email. */
export function ContactForm({ accessKey, email, labels }: { accessKey: string; email: string; labels: Labels }) {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.botcheck) return;

    if (!accessKey) {
      const body = `${data.message}\n\n— ${data.name} <${data.email}>`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(data.subject || data.name)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: accessKey, from_name: data.name, subject: data.subject || `Website message from ${data.name}`, ...data }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message);
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="cf-name">{labels.name}</Label>
          <Input id="cf-name" name="name" autoComplete="name" required maxLength={120} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cf-email">{labels.email}</Label>
          <Input id="cf-email" name="email" type="email" autoComplete="email" dir="ltr" required maxLength={200} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cf-subject">{labels.subject}</Label>
        <Input id="cf-subject" name="subject" maxLength={200} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cf-message">{labels.message}</Label>
        <Textarea id="cf-message" name="message" required rows={6} maxLength={5000} />
      </div>
      {/* Honeypot: hidden from people, tempting for bots. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === 'sending'}>
          {status === 'sending' ? <Loader2 className="animate-spin" aria-hidden /> : <Send className="rtl:-scale-x-100" aria-hidden />}
          {status === 'sending' ? labels.sending : labels.send}
        </Button>
        {!accessKey && <p className="text-xs text-muted-foreground">{labels.mailtoNote}</p>}
      </div>

      <div aria-live="polite" role="status">
        {status === 'success' && (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
            {labels.success}
          </p>
        )}
        {status === 'error' && (
          <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
            <TriangleAlert className="size-4 text-destructive" aria-hidden />
            {labels.error}
          </p>
        )}
      </div>
    </form>
  );
}
