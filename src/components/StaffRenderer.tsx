"use client";
import React, { useEffect, useRef } from "react";
import { Factory } from "vexflow";

import { useAudio } from "@/contexts/AudioContext";
import { COMMON_STYLES } from "@/lib/design";
import { useBorder } from "@/lib/hooks";
import { useMusical } from "@/contexts/MusicalContext";
import { prepareChordProgressionSequence } from "@/lib/sequencePlaybackHelpers";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { makeDurated } from "@/types/Durated";

import { SpellingUtils } from "@/utils/SpellingUtils";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { StaffUtils } from "@/utils/StaffUtils";
import { VexFlowUtils } from "@/utils/VexFlowUtils";
import {
  useIsChordProgressionsMode,
  useIsScalePreviewMode,
} from "@/lib/hooks/useGlobalMode";

interface StaffRendererProps {
  style?: React.CSSProperties;
}

/** Optional CSS vars; match `globals.css` :root */
const STAFF_CSS_VARS = {
  staveStroke: "--staff-stave-stroke",
  activeChordBg: "--staff-active-chord-bg",
} as const;

function readStaffCssVar(name: keyof typeof STAFF_CSS_VARS): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(STAFF_CSS_VARS[name])
    .trim();
}

export const StaffRenderer: React.FC<StaffRendererProps> = ({ style }) => {
  const staffDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedNoteIndices, selectedMusicalKey, currentChordRef } =
    useMusical();
  const { selectedProgression, activeProgressionStepIndex } = useAudio();
  const isChordProgressionsMode = useIsChordProgressionsMode();
  const isScalesMode = useIsScalePreviewMode();
  const border = useBorder();

  useEffect(() => {
    if (!staffDivRef.current || !containerRef.current) return;

    const staffDiv = staffDivRef.current;
    staffDiv.innerHTML = "";

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const factory = new Factory({
      renderer: {
        elementId: staffDiv.id,
        width: containerWidth,
        height: containerHeight,
      },
    });

    const context = factory.getContext();

    const stave = VexFlowUtils.createStaveForContainer(factory, containerWidth);

    const canonicalIonianKey = selectedMusicalKey.getCanonicalIonianKey();
    const keySignature =
      VexFlowFormatter.getKeySignatureForVex(canonicalIonianKey);
    stave.addClef("treble").addKeySignature(keySignature);
    const staveStroke =
      readStaffCssVar("staveStroke") || "rgb(0, 0, 0)";
    stave.setStyle({ strokeStyle: staveStroke });
    stave.setContext(context).draw();

    const progressionBarMode =
      isChordProgressionsMode &&
      selectedProgression != null &&
      activeProgressionStepIndex != null;

    if (progressionBarMode) {
      const progression =
        ChordProgressionLibrary.getProgression(selectedProgression);
      const prepared = prepareChordProgressionSequence(
        selectedProgression,
        selectedMusicalKey,
      );
      const cpf = new ChordProgressionFormatter(progression);
      const barIndex = cpf.findBarIndexContainingStep(
        activeProgressionStepIndex,
      );
      const stepIndicesInBar = cpf.progressionEntryIndicesByBar[barIndex] ?? [];

      const steps = StaffUtils.buildDuratedChordStepsForBar(
        prepared,
        stepIndicesInBar,
        canonicalIonianKey,
      );

      if (steps.length === 0) return;
      const notes = VexFlowFormatter.createStaveChordNotes(steps, factory);
      const highlightIndex = stepIndicesInBar.indexOf(
        activeProgressionStepIndex,
      );
      if (highlightIndex >= 0) {
        VexFlowUtils.drawVoiceWithHighlights(
          factory,
          stave,
          notes,
          containerWidth,
          {
            backgroundNoteIndex: highlightIndex,
            backgroundFill:
              readStaffCssVar("activeChordBg") || "rgba(11, 31, 245, 0.15)",
          },
        );
      } else {
        VexFlowUtils.drawVoice(factory, stave, notes, containerWidth);
      }

      return;
    }

    if (selectedNoteIndices.length === 0) return;

    const notesWithOctaves = SpellingUtils.computeNotesWithOptimalStrategy(
      selectedNoteIndices,
      canonicalIonianKey,
      currentChordRef,
    );

    const notes = VexFlowFormatter.createStaveChordNotes(
      [makeDurated(notesWithOctaves, 1)],
      factory,
    );

    VexFlowUtils.drawVoice(factory, stave, notes, containerWidth);
  }, [
    selectedNoteIndices,
    selectedMusicalKey,
    currentChordRef,
    isScalesMode,
    isChordProgressionsMode,
    selectedProgression,
    activeProgressionStepIndex,
  ]);

  return (
    <div
      className={`staff-container ${COMMON_STYLES.staff} ${border}`}
      style={style}
      ref={containerRef}
    >
      <div
        className="staff-canvas"
        id="staff"
        ref={staffDivRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      />
    </div>
  );
};
