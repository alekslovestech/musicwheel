"use client";

import { COMMON_STYLES, NOTATION_LAYOUT } from "@/lib/design";
import { usePageLayout, useBorder } from "@/lib/hooks";

import { ChordNameDisplay } from "@/components/ChordNameDisplay";
import { StaffRenderer } from "@/components/StaffRenderer";
import { InputSettings } from "@/components/Settings/InputSettings";
import { SettingsPanelDefault } from "@/components/Settings/SettingsPanelDefault";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { CircularViewOverlay } from "@/components/CircularViewOverlay";

export default function Home() {
  const { gridRows, gridAreas, gridColumns } = usePageLayout();
  const border = useBorder();
  const SHOW_STAFF_RENDERER = process.env.NEXT_PUBLIC_SHOW_STAFF_RENDERER !== "false";
  return (
    <div
      className={`DefaultPage-container ${COMMON_STYLES.pageContainer} bg-canvas-bgDefault ${border}`}
    >
      <div
        className={`DefaultPage-grid ${COMMON_STYLES.pageGrid} ${border}`}
        style={{
          gridTemplateColumns: gridColumns,
          gridTemplateRows: gridRows,
          gridTemplateAreas: gridAreas,
          width: "100%",
        }}
      >
        {SHOW_STAFF_RENDERER && (
          <div
            className="grid"
            style={{
              gridArea: "staff",
              ...NOTATION_LAYOUT,
            }}
          >
            <StaffRenderer />
            <ChordNameDisplay />
          </div>
        )}
        <div
          className={`DefaultPage-settings-container ${COMMON_STYLES.settingsPanel} ${border}`}
          style={{ gridArea: "settings" }}
        >
          <InputSettings />
        </div>
        <div
          className={`DefaultPage-circular-container ${COMMON_STYLES.circularContainer} ${border}`}
          style={{ gridArea: "circular" }}
        >
          <CircularViewOverlay />

          <div className={`DefaultPage-circular-inner ${COMMON_STYLES.circularInner} ${border}`}>
            <KeyboardCircular />
            <div className="flex-1 h-full">
              <SettingsPanelDefault />
            </div>
          </div>
          <div className="DefaultPage-chord-sidebar self-end mb-normal flex flex-col justify-end text-right max-w-[120px] p-2">
            <div className="DefaultPage-chord-display w-full h-full flex items-center justify-center text-2xl break-words">
              <ChordNameDisplay />
            </div>
          </div>
        </div>

        <div
          className={`DefaultPage-linear-container ${COMMON_STYLES.linearContainer} ${border}`}
          style={{ gridArea: "linear" }}
        >
          <KeyboardLinear />
        </div>
      </div>
    </div>
  );
}
