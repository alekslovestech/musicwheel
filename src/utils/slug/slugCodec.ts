export interface SlugCodec<TValue> {
  defaultSlug: string;
  slugToValue(slug: string): TValue | undefined;
  valueToSlug(value: TValue): string;
}

export function createSlugCodec<TValue>(
  map: Record<string, TValue>,
  defaultSlug: string
): SlugCodec<TValue> {
  return {
    defaultSlug,
    slugToValue: (slug) => map[slug.toLowerCase()],
    valueToSlug: (value) =>
      Object.entries(map).find(([, v]) => v === value)?.[0] ?? defaultSlug,
  };
}
