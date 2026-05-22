export const SCALES_BASE_PATH = "/scales";
export const PROGRESSIONS_BASE_PATH = "/progressions";
export const DEMO_QUERY_PARAM = "isDemo";

const withDemo = (path: string, demo?: boolean) =>
  demo ? `${path}?${DEMO_QUERY_PARAM}` : path;

export const scalePath = (slug: string, demo?: boolean) =>
  withDemo(`${SCALES_BASE_PATH}/${slug}`, demo);

export const progressionPath = (slug: string, demo?: boolean) =>
  withDemo(`${PROGRESSIONS_BASE_PATH}/${slug}`, demo);
