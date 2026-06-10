"use client";

import { CP_NOTATION_MAX_WIDTH, STAFF_HEIGHT_PX } from "@/lib/design/LayoutConstants";
import { useBorder, useIsLandscape } from "@/lib/hooks";

import { ProgressionChordScore } from "./ProgressionChordScore";
import { ProgressionControls } from "./ProgressionControls";
import { StaffRenderer } from "../StaffRenderer";

export function ProgressionNotationBlock() {
  const border = useBorder();
  const isLandscape = useIsLandscape();

  return (
    <div
      id="progression-notation-block"
      className={`flex w-full flex-col items-center p-2 ${border} ${
        isLandscape ? "min-h-0 overflow-hidden" : "shrink-0"
      }`}
    >
      <div
        id="progression-notation-column"
        className={`flex w-full min-w-0 flex-col gap-2 ${
          isLandscape ? "min-h-0 flex-1" : "shrink-0"
        }`}
        style={{ maxWidth: CP_NOTATION_MAX_WIDTH }}
      >
        <div className="w-full shrink-0" style={{ height: STAFF_HEIGHT_PX }}>
          <StaffRenderer />
        </div>
        <ProgressionChordScore />
        <ProgressionControls />
      </div>
    </div>
  );
}
