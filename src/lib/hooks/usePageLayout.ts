import { useIsLandscape } from "./useIsLandscape";
import { useGlobalMode } from "./useGlobalMode";
import { LAYOUT_CONFIGS } from "@/lib/design/LayoutConstants";
import { GlobalMode } from "@/types/enums/GlobalMode";

interface PageLayout {
  gridRows: string;
  gridAreas: string;
  gridColumns: string;
}

const GRID_COLUMNS = "1fr 1fr";
/** Narrower circular column in CP landscape so the notation column gets more width. */
const CP_GRID_COLUMNS_LANDSCAPE = "1fr 2fr";

export function usePageLayout(): PageLayout {
  const mode = useGlobalMode();
  const isLandscape = useIsLandscape();

  const config = LAYOUT_CONFIGS[mode][isLandscape ? "landscape" : "portrait"];

  const gridColumns =
    mode === GlobalMode.ChordProgressions && isLandscape
      ? CP_GRID_COLUMNS_LANDSCAPE
      : GRID_COLUMNS;

  return {
    gridRows: config.gridRows,
    gridAreas: config.gridAreas,
    gridColumns,
  };
}
