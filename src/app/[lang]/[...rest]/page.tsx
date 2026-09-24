import { notFound } from 'next/navigation';

// Any other URL under a language renders that language's 404 page inside the normal layout.
export default function CatchAll() {
  notFound();
}
