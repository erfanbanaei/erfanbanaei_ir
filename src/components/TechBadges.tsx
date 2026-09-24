import { Badge } from '@/components/ui/badge';

export function TechBadges({
  items,
  limit,
  variant = 'secondary',
}: {
  items: string[];
  limit?: number;
  variant?: 'secondary' | 'outline' | 'brand';
}) {
  const shown = limit ? items.slice(0, limit) : items;
  const rest = items.length - shown.length;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <li key={item}>
          <Badge variant={variant} dir="ltr" className="font-normal">
            {item}
          </Badge>
        </li>
      ))}
      {rest > 0 && (
        <li>
          <Badge variant="outline" dir="ltr" className="font-normal text-muted-foreground">
            +{rest}
          </Badge>
        </li>
      )}
    </ul>
  );
}
