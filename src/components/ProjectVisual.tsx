import Image from 'next/image';

import { cn } from '@/lib/utils';

/**
 * A project's image, or a generated placeholder (tinted by the project id) until one is uploaded.
 * Fills its parent, which sets the aspect ratio.
 */
export function ProjectVisual({
  id,
  title,
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  id: string;
  title: string;
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover transition-transform duration-700 group-hover:scale-[1.04]', className)}
      />
    );
  }
  const hash = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const hue = 180 + (hash % 45);
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn('absolute inset-0 grid place-items-center overflow-hidden', className)}
      style={{
        background: `radial-gradient(circle at 25% 20%, hsl(${hue} 90% 55% / .38), transparent 55%), radial-gradient(circle at 85% 85%, hsl(${hue + 35} 90% 60% / .3), transparent 50%), var(--muted)`,
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative flex h-[70%] aspect-[9/17] flex-col items-center justify-center gap-2 rounded-[1.4rem] border border-foreground/10 bg-card/75 shadow-xl backdrop-blur transition-transform duration-700 group-hover:-translate-y-1.5 group-hover:rotate-[-2deg]">
        <span
          className="grid size-11 place-items-center rounded-2xl text-lg font-bold text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, hsl(${hue} 85% 45%), hsl(${hue + 35} 85% 55%))` }}
          aria-hidden
        >
          {title.trim().charAt(0).toUpperCase()}
        </span>
        <span className="h-1.5 w-10 rounded-full bg-foreground/10" aria-hidden />
        <span className="h-1.5 w-6 rounded-full bg-foreground/10" aria-hidden />
      </div>
    </div>
  );
}
