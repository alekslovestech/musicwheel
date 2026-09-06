"use client";

import { Suspense } from "react";

import { CircularViewOverlay } from "@/components/CircularViewOverlay";
import { ProgressionNotationBlock } from "@/components/ChordProgression/ProgressionNotationBlock";
import { SequenceViewPage } from "@/components/SequenceView/SequenceViewPage";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
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
        notation={<ProgressionNotationBlock />}
        circularOverlay={<CircularViewOverlay />}
        circular={<KeyboardCircular />}
        linear={<KeyboardLinear />}
      />
    </>
  );
}
