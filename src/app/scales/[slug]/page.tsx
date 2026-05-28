"use client";

import { Suspense } from "react";
import Link from "next/link";

import { ColorLegendOverlay } from "@/components/ColorLegend/ColorLegendOverlay";
import { SequenceViewPage } from "@/components/SequenceView/SequenceViewPage";
import { GlobalModeButton } from "@/components/Buttons/GlobalModeButton";
import { ChordNameDisplay } from "@/components/ChordNameDisplay";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { SettingsPanelScales } from "@/components/Settings/SettingsPanelScales";
import { StaffRenderer } from "@/components/StaffRenderer";
import { useIsDemoRoute } from "@/lib/hooks";
import { useScaleSlugPage } from "@/lib/hooks/useSlugUrlSync";
import { harmonyPath } from "@/utils/slug/paths";

function BasicModeLink() {
  const isDemoRoute = useIsDemoRoute();
  if (isDemoRoute) return null;

  return (
    <div className="absolute top-2 left-2 z-10">
      <Link href={harmonyPath(isDemoRoute)}>
        <GlobalModeButton text="Basic Mode" />
      </Link>
    </div>
  );
}

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
        circularOverlay={
          <Suspense fallback={null}>
            <BasicModeLink />
            <ColorLegendOverlay />
          </Suspense>
        }
        circular={<KeyboardCircular />}
        linear={<KeyboardLinear />}
        settings={<SettingsPanelScales />}
      />
    </>
  );
}
