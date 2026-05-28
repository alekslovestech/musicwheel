"use client";

import { Suspense } from "react";

import { CircularViewOverlay } from "@/components/CircularViewOverlay";
import { SequenceViewPage } from "@/components/SequenceView/SequenceViewPage";
import { ChordNameDisplay } from "@/components/ChordNameDisplay";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { SettingsPanelScales } from "@/components/Settings/SettingsPanelScales";
import { StaffRenderer } from "@/components/StaffRenderer";
import { useScaleSlugPage } from "@/lib/hooks/useSlugUrlSync";

function ScaleSlugPageSync() {
  useScaleSlugPage();
  return null;
}

export default function ScalesSlugPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ScaleSlugPageSync />
      </Suspense>
      <SequenceViewPage
        pageId="ScalesPage"
        backgroundClass="bg-canvas-bgScales"
        settingsGridArea="sidebar"
        staff={
          <>
            <StaffRenderer />
            <ChordNameDisplay />
          </>
        }
        circularOverlay={<CircularViewOverlay />}
        circular={<KeyboardCircular />}
        linear={<KeyboardLinear />}
        settings={<SettingsPanelScales />}
      />
    </>
  );
}
