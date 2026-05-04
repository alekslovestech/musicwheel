"use client";

import { COMMON_STYLES, NOTATION_LAYOUT } from "@/lib/design";
import { usePageLayout, useBorder } from "@/lib/hooks";

import { ChordNameDisplay } from "@/components/ChordNameDisplay";
import { StaffRenderer } from "@/components/StaffRenderer";
import { InputSettings } from "@/components/Settings/InputSettings";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";

export default function Home() {
  const { gridRows, gridAreas, gridColumns } = usePageLayout();
  const border = useBorder();

  return (
    <div className={`DemoPage-container ${COMMON_STYLES.pageContainer} bg-canvas-bgDefault`}>
      <div
        className={`DemoPage-grid ${COMMON_STYLES.pageGrid} ${border}`}
        style={{
          gridTemplateColumns: gridColumns,
          gridTemplateRows: gridRows,
          gridTemplateAreas: gridAreas,
          width: "100%",
        }}
      >
        <div
          className="grid"
          style={{
            gridArea: "staff",
            ...NOTATION_LAYOUT,
          }}
        >
          <StaffRenderer />
          <div className="w-full h-full"></div>
        </div>

        <div
          className={`DemoPage-circular-container ${COMMON_STYLES.circularContainer} ${border}`}
          style={{ gridArea: "circular" }}
        >
          <div className={`DemoPage-circular-inner ${COMMON_STYLES.circularInner}`}>
            <div className="w-[70%]">
              <KeyboardCircular />
            </div>
            <div className="w-[30%] h-full flex items-center justify-center">
              <ChordNameDisplay />
            </div>
          </div>
        </div>

        <div
          className={`DemoPage-linear-container ${COMMON_STYLES.linearContainer} ${border}`}
          style={{ gridArea: "linear" }}
        >
          <KeyboardLinear />
        </div>

        <div
          className={`DemoPage-settings-container ${COMMON_STYLES.settingsPanel} ${border}`}
          style={{ gridArea: "settings" }}
        >
          <InputSettings />
        </div>
      </div>
    </div>
  );
}
