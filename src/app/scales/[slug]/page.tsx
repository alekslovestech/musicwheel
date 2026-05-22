"use client";

import Link from "next/link";

import { SequenceViewPage } from "@/components/SequenceView/SequenceViewPage";
import { GlobalModeButton } from "@/components/Buttons/GlobalModeButton";
import { ChordNameDisplay } from "@/components/ChordNameDisplay";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { SettingsPanelScales } from "@/components/Settings/SettingsPanelScales";
import { StaffRenderer } from "@/components/StaffRenderer";
import { useIsDemoRoute } from "@/lib/hooks";
import { useScaleSlugPage } from "@/lib/hooks/useSlugUrlSync";

export default function ScalesSlugPage() {
  const isDemoRoute = useIsDemoRoute();

  useScaleSlugPage();

  return (
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
        !isDemoRoute ? (
          <div className="absolute top-2 left-2 z-10">
            <Link href="/harmony">
              <GlobalModeButton text="Basic Mode" />
            </Link>
          </div>
        ) : undefined
      }
      circular={<KeyboardCircular />}
      linear={<KeyboardLinear />}
      settings={<SettingsPanelScales />}
    />
  );
}
