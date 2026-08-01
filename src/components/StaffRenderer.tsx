"use client";
import React, { useEffect, useRef } from "react";
import { Factory } from "vexflow";

import { PlaybackState, useAudio } from "@/contexts/AudioContext";
import { COMMON_STYLES } from "@/lib/design";
import { useBorder } from "@/lib/hooks";
import { useMusical } from "@/contexts/MusicalContext";
import { prepareChordProgressionSequence } from "@/utils/SequencePlaybackUtils";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { PROGRESSION_REGISTRY } from "@/types/ChordProgressions/progressionRegistry";
import { makeDurated } from "@/types/Durated";

import { SpellingUtils } from "@/utils/SpellingUtils";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { StaffUtils, SCALE_STAFF_DRAW_OPTIONS } from "@/utils/StaffUtils";
import { VexFlowUtils } from "@/utils/VexFlowUtils";
import { chordActiveHighlightFor } from "@/utils/visual/NoteGroupingColorRegistry";
import { useGlobalMode, useIsChordProgressionsMode, useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { resolveSpellingContext } from "@/utils/spelling/SpellingContext";

export const StaffRenderer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const staffDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedNoteIndices, selectedMusicalKey, currentChordRef } = useMusical();
  const {
    selectedProgression,
    scalePlaybackMode,
    activeStepIndex,
    playbackState,
  } = useAudio();
  const isChordProgressionsMode = useIsChordProgressionsMode();
  const isScalesMode = useIsScalePreviewMode();
  const globalMode = useGlobalMode();
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

    const staffSpellingKey = selectedMusicalKey.getStaffSpellingKey();
    const keySignature = VexFlowFormatter.getKeySignatureForVex(staffSpellingKey);
    stave.addClef("treble").addKeySignature(keySignature);
    stave.setContext(context).draw();

    const progressionBarMode =
      isChordProgressionsMode && selectedProgression != null && activeStepIndex != null;

    if (progressionBarMode) {
      const progression = ChordProgressionLibrary.getProgression(selectedProgression);
      const cpf = new ChordProgressionFormatter(progression);
      const activeRoman = progression.progression[activeStepIndex]?.value;
      const activeChordBg = chordActiveHighlightFor(activeRoman?.chordType).css();

      const prepared = prepareChordProgressionSequence(selectedProgression, selectedMusicalKey);
      const isCompact = PROGRESSION_REGISTRY[selectedProgression].isPattern;
      const stepIndicesInRow = cpf.stepIndicesForDisplayRow(
        activeStepIndex,
        isCompact,
      );

      const steps = StaffUtils.buildDuratedChordStepsForBar(
        prepared,
        stepIndicesInRow,
        staffSpellingKey,
      );

      if (steps.length === 0) return;
      const notes = VexFlowFormatter.createStaveChordNotes(steps, factory);
      const highlightIndex = stepIndicesInRow.indexOf(activeStepIndex);
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

    if (isScalesMode) {
      const steps = StaffUtils.buildDuratedScaleStepsForBar(
        selectedMusicalKey,
        scalePlaybackMode,
        staffSpellingKey,
      );

      if (steps.length === 0) return;

      const notes = VexFlowFormatter.createStaveChordNotes(steps, factory);

      const isScalePlaybackActive =
        playbackState === PlaybackState.SequencePlaying ||
        playbackState === PlaybackState.SequencePaused;

      const highlightIndex = isScalePlaybackActive
        ? activeStepIndex
        : StaffUtils.findScaleStepIndexForSelection(
            selectedMusicalKey,
            scalePlaybackMode,
            selectedNoteIndices,
          );

      if (highlightIndex != null && highlightIndex >= 0) {
        VexFlowUtils.drawVoiceWithHighlights(
          factory,
          stave,
          notes,
          highlightIndex,
          StaffUtils.scaleStaffHighlightColor(
            selectedMusicalKey,
            scalePlaybackMode,
            highlightIndex,
          ),
          SCALE_STAFF_DRAW_OPTIONS,
        );
      } else {
        VexFlowUtils.drawVoice(factory, stave, notes, SCALE_STAFF_DRAW_OPTIONS);
      }

      return;
    }

    if (selectedNoteIndices.length === 0) return;

    const spelling = resolveSpellingContext({
      globalMode,
      musicalKey: selectedMusicalKey,
      currentChordRef,
    });
    const notesWithOctaves = SpellingUtils.computeNotesForStaff(
      selectedNoteIndices,
      staffSpellingKey,
      spelling,
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
    globalMode,
    isChordProgressionsMode,
    isScalesMode,
    selectedProgression,
    activeStepIndex,
    scalePlaybackMode,
    activeStepIndex,
    playbackState,
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
