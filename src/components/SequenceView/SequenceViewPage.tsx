"use client";

import type { CSSProperties, ReactNode } from "react";

import { COMMON_STYLES, NOTATION_LAYOUT } from "@/lib/design";
import { usePageLayout, useBorder, useIsLandscape } from "@/lib/hooks";

interface SequenceViewPageProps {
  pageId: string;
  backgroundClass: string;
  settingsGridArea?: string;
  staff?: ReactNode;
  /** CP mode: staff + bar display share one width-constrained column. */
  notation?: ReactNode;
  staffStyle?: CSSProperties;
  circularOverlay?: ReactNode;
  circular: ReactNode;
  /** Rendered in flow beneath the wheel, which shrinks to make room. */
  circularFooter?: ReactNode;
  linear: ReactNode;
  settings?: ReactNode;
}

export function SequenceViewPage({
  pageId,
  backgroundClass,
  settingsGridArea,
  staff,
  notation,
  staffStyle,
  circularOverlay,
  circular,
  circularFooter,
  linear,
  settings,
}: SequenceViewPageProps) {
  const { gridRows, gridAreas, gridColumns } = usePageLayout();
  const border = useBorder();
  const isLandscape = useIsLandscape();

  return (
    <div
      className={`${pageId}-container ${COMMON_STYLES.pageContainer} ${backgroundClass} ${border}`}
    >
      <div
        className={`${pageId}-grid ${COMMON_STYLES.pageGrid} ${border}`}
        style={{
          gridTemplateColumns: gridColumns,
          gridTemplateRows: gridRows,
          gridTemplateAreas: gridAreas,
          width: "100%",
        }}
      >
        {notation != null ? (
          <div
            className={`${pageId}-notation flex min-w-0 flex-col ${
              isLandscape ? "min-h-0 overflow-hidden" : "shrink-0"
            }`}
            style={{ gridArea: "notation" }}
          >
            {notation}
          </div>
        ) : (
          staff != null && (
            <div
              className={`${pageId}-staff grid`}
              style={{
                gridArea: "staff",
                ...NOTATION_LAYOUT,
                ...staffStyle,
              }}
            >
              {staff}
            </div>
          )
        )}
        {/* Column so circularFooter takes its space out of the wheel rather than overlapping it.
            Applied here rather than in COMMON_STYLES: the harmony page reuses those classes
            with a different child structure. */}
        <div
          className={`${pageId}-circular ${COMMON_STYLES.circularContainer} flex flex-col ${border}`}
          style={{ gridArea: "circular" }}
        >
          {circularOverlay}
          <div
            className={`${pageId}-circular-inner ${COMMON_STYLES.circularInner} min-h-0 flex-1 ${border}`}
          >
            {circular}
          </div>
          {circularFooter != null && (
            <div className={`${pageId}-circular-footer shrink-0`}>{circularFooter}</div>
          )}
        </div>
        <div
          className={`${pageId}-linear-container ${COMMON_STYLES.linearContainer} ${border}`}
          style={{ gridArea: "linear" }}
        >
          {linear}
        </div>
        {settings != null && settingsGridArea != null && (
          <div
            className={`${pageId}-settings-container ${COMMON_STYLES.settingsPanel} ${border}`}
            style={{ gridArea: settingsGridArea }}
          >
            {settings}
          </div>
        )}
      </div>
    </div>
  );
}
