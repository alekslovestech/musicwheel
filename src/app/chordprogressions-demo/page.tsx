"use client";

import { COMMON_STYLES, NOTATION_LAYOUT } from "@/lib/design";
import { usePageLayout, useBorder } from "@/lib/hooks";

import { StaffRenderer } from "@/components/StaffRenderer";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { SettingsPanelChordProgressions } from "@/components/Settings/SettingsPanelChordProgressions";

export default function ChordProgressionsPage() {
  const { gridRows, gridAreas, gridColumns } = usePageLayout();
  const border = useBorder();

  return (
    <div
      className={`ChordProgressionsPage-container ${COMMON_STYLES.pageContainer} bg-canvas-bgDefault ${border}`}
    >
      <div
        className={`ChordProgressionsPage-grid ${COMMON_STYLES.pageGrid} ${border}`}
        style={{
          gridTemplateColumns: gridColumns,
          gridTemplateRows: gridRows,
          gridTemplateAreas: gridAreas,
          width: "100%",
        }}
      >
        <div
          className="ChordProgressionsPage-staff grid"
          style={{
            gridArea: "staff",
            ...NOTATION_LAYOUT,
            gridTemplateColumns: "1fr",
          }}
        >
          <StaffRenderer />
        </div>
        <div
          className={`ChordProgressionsPage-circular ${COMMON_STYLES.circularContainer} ${border}`}
          style={{ gridArea: "circular" }}
        >
          <div
            className={`ChordProgressionsPage-circular-inner ${COMMON_STYLES.circularInner} ${border}`}
          >
            <KeyboardCircular />
          </div>
        </div>

        <div
          className={`ChordProgressionsPage-linear-container ${COMMON_STYLES.linearContainer} ${border}`}
          style={{ gridArea: "linear" }}
        >
          <KeyboardLinear />
        </div>

        <div
          className={`ChordProgressionsPage-settings-container ${COMMON_STYLES.settingsPanel} ${border}`}
          style={{ gridArea: "sidebar" }}
        >
          <SettingsPanelChordProgressions />
        </div>
      </div>
    </div>
  );
}
