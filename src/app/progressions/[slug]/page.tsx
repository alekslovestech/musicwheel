"use client";

import { Suspense } from "react";

import { ColorLegendOverlay } from "@/components/ColorLegend/ColorLegendOverlay";
import { SequenceViewPage } from "@/components/SequenceView/SequenceViewPage";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { SettingsPanelChordProgressions } from "@/components/Settings/SettingsPanelChordProgressions";
import { StaffRenderer } from "@/components/StaffRenderer";
import { useProgressionSlugPage } from "@/lib/hooks/useSlugUrlSync";

function ProgressionSlugPageSync() {
  useProgressionSlugPage();
  return null;
}

export default function ProgressionSlugPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ProgressionSlugPageSync />
      </Suspense>
      <SequenceViewPage
        pageId="ProgressionsPage"
        backgroundClass="bg-canvas-bgDefault"
        settingsGridArea="progression"
        staff={<StaffRenderer />}
        staffStyle={{ gridTemplateColumns: "1fr" }}
        circularOverlay={
          <Suspense fallback={null}>
            <ColorLegendOverlay />
          </Suspense>
        }
        circular={<KeyboardCircular />}
        linear={<KeyboardLinear />}
        settings={<SettingsPanelChordProgressions />}
      />
    </>
  );
}
