"use client";
import Link from "next/link";
import { useEffect } from "react";

import { COMMON_STYLES, NOTATION_LAYOUT } from "@/lib/design";
import { usePageLayout, useBorder, useIsDemoRoute } from "@/lib/hooks";

import { StaffRenderer } from "@/components/StaffRenderer";
import { ChordNameDisplay } from "@/components/ChordNameDisplay";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { SettingsPanelScales } from "@/components/Settings/SettingsPanelScales";
import { GlobalModeButton } from "@/components/Buttons/GlobalModeButton";

import { useAudio } from "@/contexts/AudioContext";
import { useMusical } from "@/contexts/MusicalContext";

export default function ScalesPage() {
  const { gridRows, gridAreas, gridColumns } = usePageLayout();
  const border = useBorder();
  const isDemoRoute = useIsDemoRoute();
  const { isAudioInitialized, startSequencePlayback } = useAudio();
  const { selectedMusicalKey } = useMusical();

  // Autoplay when entering scales mode and audio is initialized
  useEffect(() => {
    if (isAudioInitialized && selectedMusicalKey) {
      startSequencePlayback();
    }
  }, [isAudioInitialized, selectedMusicalKey, startSequencePlayback]);

  return (
    <div
      className={`ScalesPage-container ${COMMON_STYLES.pageContainer} bg-canvas-bgScales ${border}`}
    >
      <div
        className={`ScalesPage-grid ${COMMON_STYLES.pageGrid} ${border}`}
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
          <ChordNameDisplay />
        </div>
        <div
          className={`ScalesPage-circular ${COMMON_STYLES.circularContainer} ${border}`}
          style={{ gridArea: "circular" }}
        >
          {/* Add GlobalModeButton positioned in top-left corner */}
          {!isDemoRoute && (
            <div className="absolute top-2 left-2 z-10">
              <Link href="/harmony">
                <GlobalModeButton text="Basic Mode" />
              </Link>
            </div>
          )}

          <div className={`ScalesPage-circular-inner ${COMMON_STYLES.circularInner} ${border}`}>
            <KeyboardCircular />
          </div>
        </div>

        <div
          className={`ScalesPage-linear-container ${COMMON_STYLES.linearContainer} ${border}`}
          style={{ gridArea: "linear" }}
        >
          <KeyboardLinear />
        </div>

        <div
          className={`ScalesPage-settings-container ${COMMON_STYLES.settingsPanel} ${border}`}
          style={{ gridArea: "sidebar" }}
        >
          <SettingsPanelScales />
        </div>
      </div>
    </div>
  );
}
