"use client";

import { COMMON_STYLES, NOTATION_LAYOUT } from "@/lib/design";
import { usePageLayout, useBorder } from "@/lib/hooks";
import { useProgressionUrlSync } from "@/lib/hooks/useProgressionUrlSync";

import { StaffRenderer } from "@/components/StaffRenderer";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { SettingsPanelChordProgressions } from "@/components/Settings/SettingsPanelChordProgressions";

export default function ProgressionsPage() {
  const { gridRows, gridAreas, gridColumns } = usePageLayout();
  const border = useBorder();

  // Redirect /progressions → /progressions/<current-selection> and keep URL in sync
  useProgressionUrlSync();

  return (
    <div
      className={`ProgressionsPage-container ${COMMON_STYLES.pageContainer} bg-canvas-bgDefault ${border}`}
    >
      <div
        className={`ProgressionsPage-grid ${COMMON_STYLES.pageGrid} ${border}`}
        style={{
          gridTemplateColumns: gridColumns,
          gridTemplateRows: gridRows,
          gridTemplateAreas: gridAreas,
          width: "100%",
        }}
      >
        <div
          className="ProgressionsPage-staff grid"
          style={{
            gridArea: "staff",
            ...NOTATION_LAYOUT,
            gridTemplateColumns: "1fr",
          }}
        >
          <StaffRenderer />
        </div>
        <div
          className={`ProgressionsPage-circular ${COMMON_STYLES.circularContainer} ${border}`}
          style={{ gridArea: "circular" }}
        >
          <div
            className={`ProgressionsPage-circular-inner ${COMMON_STYLES.circularInner} ${border}`}
          >
            <KeyboardCircular />
          </div>
        </div>

        <div
          className={`ProgressionsPage-linear-container ${COMMON_STYLES.linearContainer} ${border}`}
          style={{ gridArea: "linear" }}
        >
          <KeyboardLinear />
        </div>

        <div
          className={`ProgressionsPage-settings-container ${COMMON_STYLES.settingsPanel} ${border}`}
          style={{ gridArea: "progression" }}
        >
          <SettingsPanelChordProgressions />
        </div>
      </div>
    </div>
  );
}
