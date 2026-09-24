export function PageHeader({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      <div className="bg-aurora pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-page relative pt-16 pb-12 sm:pt-20">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">{description}</p>}
        {children}
      </div>
    </section>
  );
}
