"use client";

import type { CSSProperties, ReactNode } from "react";

import { COMMON_STYLES, NOTATION_LAYOUT } from "@/lib/design";
import { usePageLayout, useBorder } from "@/lib/hooks";

interface SequenceViewPageProps {
  pageId: string;
  backgroundClass: string;
  settingsGridArea: string;
  staff: ReactNode;
  staffStyle?: CSSProperties;
  circularOverlay?: ReactNode;
  circular: ReactNode;
  linear: ReactNode;
  settings: ReactNode;
}

export function SequenceViewPage({
  pageId,
  backgroundClass,
  settingsGridArea,
  staff,
  staffStyle,
  circularOverlay,
  circular,
  linear,
  settings,
}: SequenceViewPageProps) {
  const { gridRows, gridAreas, gridColumns } = usePageLayout();
  const border = useBorder();

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
        <div
          className={`${pageId}-circular ${COMMON_STYLES.circularContainer} ${border}`}
          style={{ gridArea: "circular" }}
        >
          {circularOverlay}
          <div className={`${pageId}-circular-inner ${COMMON_STYLES.circularInner} ${border}`}>
            {circular}
          </div>
        </div>
        <div
          className={`${pageId}-linear-container ${COMMON_STYLES.linearContainer} ${border}`}
          style={{ gridArea: "linear" }}
        >
          {linear}
        </div>
        <div
          className={`${pageId}-settings-container ${COMMON_STYLES.settingsPanel} ${border}`}
          style={{ gridArea: settingsGridArea }}
        >
          {settings}
        </div>
      </div>
    </div>
  );
}
