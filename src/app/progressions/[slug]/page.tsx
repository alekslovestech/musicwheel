"use client";

import { SequenceViewPage } from "@/components/SequenceView/SequenceViewPage";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { SettingsPanelChordProgressions } from "@/components/Settings/SettingsPanelChordProgressions";
import { StaffRenderer } from "@/components/StaffRenderer";
import { useProgressionSlugPage } from "@/lib/hooks/useSlugUrlSync";

export default function ProgressionSlugPage() {
  useProgressionSlugPage();

  return (
    <SequenceViewPage
      pageId="ProgressionsPage"
      backgroundClass="bg-canvas-bgDefault"
      settingsGridArea="progression"
      staff={<StaffRenderer />}
      staffStyle={{ gridTemplateColumns: "1fr" }}
      circular={<KeyboardCircular />}
      linear={<KeyboardLinear />}
      settings={<SettingsPanelChordProgressions />}
    />
  );
}
