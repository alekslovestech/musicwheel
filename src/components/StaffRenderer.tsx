"use client";
import React, { useEffect, useRef } from "react";
import { Factory } from "vexflow";

import { useAudio } from "@/contexts/AudioContext";
import { COMMON_STYLES } from "@/lib/design";
import { useBorder } from "@/lib/hooks";
import { useMusical } from "@/contexts/MusicalContext";
import { prepareChordProgressionSequence } from "@/lib/sequencePlaybackHelpers";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { PROGRESSION_REGISTRY } from "@/types/ChordProgressions/progressionRegistry";
import { makeDurated } from "@/types/Durated";

import { SpellingUtils } from "@/utils/SpellingUtils";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { StaffUtils } from "@/utils/StaffUtils";
import { VexFlowUtils } from "@/utils/VexFlowUtils";
import { chordActiveHighlightFor } from "@/utils/visual/NoteGroupingColorRegistry";
import { useIsChordProgressionsMode } from "@/lib/hooks/useGlobalMode";

export const StaffRenderer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const staffDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedNoteIndices, selectedMusicalKey, currentChordRef } = useMusical();
  const { selectedProgression, activeProgressionStepIndex } = useAudio();
  const isChordProgressionsMode = useIsChordProgressionsMode();
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
    const keySignature = VexFlowFormatter.getKeySignatureForVex(canonicalIonianKey);
    stave.addClef("treble").addKeySignature(keySignature);
    stave.setContext(context).draw();

    const progressionBarMode =
      isChordProgressionsMode && selectedProgression != null && activeProgressionStepIndex != null;

    if (progressionBarMode) {
      const progression = ChordProgressionLibrary.getProgression(selectedProgression);
      const cpf = new ChordProgressionFormatter(progression);
      const activeRoman = progression.progression[activeProgressionStepIndex]?.value;
      const activeChordBg = chordActiveHighlightFor(activeRoman?.chordType).css();

      const prepared = prepareChordProgressionSequence(selectedProgression, selectedMusicalKey);
      const isCompact = PROGRESSION_REGISTRY[selectedProgression].isPattern;
      const stepIndicesInRow = cpf.stepIndicesForDisplayRow(
        activeProgressionStepIndex,
        isCompact,
      );

      const steps = StaffUtils.buildDuratedChordStepsForBar(
        prepared,
        stepIndicesInRow,
        canonicalIonianKey,
      );

      if (steps.length === 0) return;
      const notes = VexFlowFormatter.createStaveChordNotes(steps, factory);
      const highlightIndex = stepIndicesInRow.indexOf(activeProgressionStepIndex);
      if (highlightIndex >= 0) {
        VexFlowUtils.drawVoiceWithHighlights(
          factory,
          stave,
          notes,
          highlightIndex,
          activeChordBg,
        );
      } else {
        VexFlowUtils.drawVoice(factory, stave, notes);
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

    VexFlowUtils.drawVoice(factory, stave, notes);
  }, [
    selectedNoteIndices,
    selectedMusicalKey,
    currentChordRef,
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
