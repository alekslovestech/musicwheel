export interface SluggedEntry {
  slug: string;
}

export function buildSlugMap<TType extends string>(
  registry: Record<TType, SluggedEntry>,
): Record<string, TType> {
  return Object.fromEntries(
    (Object.entries(registry) as [TType, SluggedEntry][]).map(([type, entry]) => [
      entry.slug,
      type,
    ]),
  ) as Record<string, TType>;
}

export function slugToValue<TValue>(map: Record<string, TValue>, slug: string): TValue | undefined {
  return map[slug.toLowerCase()];
}

export function valueToSlug<TValue>(map: Record<string, TValue>, value: TValue | null): string {
  const defaultSlug = Object.keys(map)[0];
  if (value == null) return defaultSlug;
  return Object.entries(map).find(([, v]) => v === value)?.[0] ?? defaultSlug;
}
