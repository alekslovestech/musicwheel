"use client";
import React, { useEffect, useRef } from "react";
import { Factory, StaveNote } from "vexflow";

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
import {
  useIsChordProgressionsMode,
  useIsScalePreviewMode,
} from "@/lib/hooks/useGlobalMode";

interface StaffRendererProps {
  style?: React.CSSProperties;
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

    const stave = factory.Stave({
      x: 5,
      y: -20,
      width: containerWidth - 10,
    });

    const canonicalIonianKey = selectedMusicalKey.getCanonicalIonianKey();
    const keySignature =
      VexFlowFormatter.getKeySignatureForVex(canonicalIonianKey);
    stave.addClef("treble").addKeySignature(keySignature);
    stave.setStyle({ strokeStyle: "black" });
    stave.setContext(context).draw();

    const drawVoice = (tickables: StaveNote[]) => {
      const voice = factory.Voice({ time: "4/4" });
      voice.setStrict(false);
      voice.addTickables(tickables);
      factory
        .Formatter()
        .joinVoices([voice])
        .format([voice], containerWidth - 20);
      voice.draw(context, stave);
    };

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

      if (steps.length > 0) {
        const notes = VexFlowFormatter.createStaveChordNotes(steps, factory);
        drawVoice(notes);
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

    drawVoice(notes);
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
