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

export interface SlugCodec<TValue> {
  slugToValue(slug: string): TValue | undefined;
  valueToSlug(value: TValue | null): string;
}

export function createSlugCodec<TValue>(map: Record<string, TValue>): SlugCodec<TValue> {
  const defaultSlug = Object.keys(map)[0];

  return {
    slugToValue: (slug) => map[slug.toLowerCase()],
    valueToSlug: (value) =>
      value == null
        ? defaultSlug
        : Object.entries(map).find(([, v]) => v === value)?.[0] ?? defaultSlug,
  };
}
