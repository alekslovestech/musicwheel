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
