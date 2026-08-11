"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Factory, type BoundingBox, type Stave } from "vexflow";

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
import { StaffHighlightOverlay, VexFlowUtils } from "@/utils/VexFlowUtils";
import { chordActiveHighlightFor } from "@/utils/visual/NoteGroupingColorRegistry";
import { useGlobalMode, useIsChordProgressionsMode, useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { resolveSpellingContext } from "@/utils/spelling/SpellingContext";

/** Where the active-step background sits, and what colour it takes. */
type StaffHighlight = { index: number | null; fill?: string };

const NO_HIGHLIGHT: StaffHighlight = { index: null };

export const StaffRenderer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const staffDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<StaffHighlightOverlay | null>(null);
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

  /**
   * Step indices making up the bar on screen. This changes only when playback crosses into
   * another display row, so keying the score rebuild off it - rather than off activeStepIndex -
   * skips the rebuild for every step within a bar.
   */
  const progressionRow = useMemo(() => {
    if (!isChordProgressionsMode || selectedProgression == null || activeStepIndex == null) {
      return null;
    }
    const progression = ChordProgressionLibrary.getProgression(selectedProgression);
    const isCompact = PROGRESSION_REGISTRY[selectedProgression].isPattern;
    return new ChordProgressionFormatter(progression).stepIndicesForDisplayRow(
      activeStepIndex,
      isCompact,
    );
  }, [isChordProgressionsMode, selectedProgression, activeStepIndex]);

  const { index: highlightIndex, fill: highlightFill } = useMemo<StaffHighlight>(() => {
    if (progressionRow && selectedProgression != null && activeStepIndex != null) {
      const progression = ChordProgressionLibrary.getProgression(selectedProgression);
      const activeRoman = progression.progression[activeStepIndex]?.value;
      return {
        index: progressionRow.indexOf(activeStepIndex),
        fill: chordActiveHighlightFor(activeRoman?.chordType).css(),
      };
    }

    if (isScalesMode) {
      const isScalePlaybackActive =
        playbackState === PlaybackState.SequencePlaying ||
        playbackState === PlaybackState.SequencePaused;

      const stepIndex = isScalePlaybackActive
        ? activeStepIndex
        : StaffUtils.findScaleStepIndexForSelection(
            selectedMusicalKey,
            scalePlaybackMode,
            selectedNoteIndices,
          );

      if (stepIndex == null || stepIndex < 0) return NO_HIGHLIGHT;
      return {
        index: stepIndex,
        fill: StaffUtils.scaleStaffHighlightColor(selectedMusicalKey, scalePlaybackMode, stepIndex),
      };
    }

    return NO_HIGHLIGHT;
  }, [
    progressionRow,
    selectedProgression,
    activeStepIndex,
    isScalesMode,
    playbackState,
    selectedMusicalKey,
    scalePlaybackMode,
    selectedNoteIndices,
  ]);

  /**
   * Everything the drawn score is made of, and nothing the highlight alone depends on. In scales
   * mode the bar is the whole scale, so stepping through it leaves this untouched and the score
   * survives the step - only the overlay moves.
   */
  const scoreKey = useMemo(() => {
    if (progressionRow) {
      return `progression|${selectedProgression}|${selectedMusicalKey}|${progressionRow.join(",")}`;
    }
    if (isScalesMode) {
      return `scale|${selectedMusicalKey}|${scalePlaybackMode}`;
    }
    const chordRefKey = currentChordRef
      ? `${currentChordRef.rootNote}:${currentChordRef.id}:${currentChordRef.inversionIndex}`
      : "";
    return `freeform|${globalMode}|${selectedMusicalKey}|${selectedNoteIndices.join(",")}|${chordRefKey}`;
  }, [
    progressionRow,
    selectedProgression,
    isScalesMode,
    selectedMusicalKey,
    scalePlaybackMode,
    globalMode,
    selectedNoteIndices,
    currentChordRef,
  ]);

  /**
   * Read through refs by the rebuild effect, which keys off {@link scoreKey} alone: the closure
   * changes every render, but only a scoreKey change means a different score.
   */
  const drawScoreRef = useRef<(factory: Factory, stave: Stave) => (BoundingBox | null)[] | null>(
    () => null,
  );
  const highlightRef = useRef<StaffHighlight>(NO_HIGHLIGHT);
  highlightRef.current = { index: highlightIndex, fill: highlightFill };

  drawScoreRef.current = (factory, stave) => {
    const context = factory.getContext();
    const staffSpellingKey = selectedMusicalKey.getStaffSpellingKey();
    stave.addClef("treble").addKeySignature(
      VexFlowFormatter.getKeySignatureForVex(staffSpellingKey),
    );
    stave.setContext(context).draw();

    if (progressionRow) {
      const prepared = prepareChordProgressionSequence(selectedProgression!, selectedMusicalKey);
      const steps = StaffUtils.buildDuratedChordStepsForBar(
        prepared,
        progressionRow,
        staffSpellingKey,
      );

      if (steps.length === 0) return null;
      return VexFlowUtils.drawVoice(
        factory,
        stave,
        VexFlowFormatter.createStaveChordNotes(steps, factory),
      );
    }

    if (isScalesMode) {
      const steps = StaffUtils.buildDuratedScaleStepsForBar(
        selectedMusicalKey,
        scalePlaybackMode,
        staffSpellingKey,
      );

      if (steps.length === 0) return null;
      return VexFlowUtils.drawVoice(
        factory,
        stave,
        VexFlowFormatter.createStaveChordNotes(steps, factory),
        SCALE_STAFF_DRAW_OPTIONS,
      );
    }

    if (selectedNoteIndices.length === 0) return null;

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

    return VexFlowUtils.drawVoice(
      factory,
      stave,
      VexFlowFormatter.createStaveChordNotes([makeDurated(notesWithOctaves, 1)], factory),
    );
  };

  /** The score is laid out against the container width, so a resize has to rebuild it. */
  const [resizeGeneration, setResizeGeneration] = useState(0);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    let lastWidth = container.clientWidth;
    let lastHeight = container.clientHeight;
    const observer = new ResizeObserver(() => {
      if (container.clientWidth === lastWidth && container.clientHeight === lastHeight) return;
      lastWidth = container.clientWidth;
      lastHeight = container.clientHeight;
      setResizeGeneration((generation) => generation + 1);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!staffDivRef.current || !containerRef.current) return;

    const staffDiv = staffDivRef.current;
    staffDiv.innerHTML = "";
    overlayRef.current = null;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const factory = new Factory({
      renderer: {
        elementId: staffDiv.id,
        width: containerWidth,
        height: containerHeight,
      },
    });

    const stave = VexFlowUtils.createStaveForContainer(factory, containerWidth);
    const highlightBoxes = drawScoreRef.current(factory, stave);
    if (!highlightBoxes) return;

    overlayRef.current = StaffHighlightOverlay.create(factory.getContext(), highlightBoxes);
    // A fresh score starts blank, so it has to be told where the highlight already is.
    overlayRef.current?.apply(highlightRef.current.index, highlightRef.current.fill);
  }, [scoreKey, resizeGeneration]);

  useEffect(() => {
    overlayRef.current?.apply(highlightIndex, highlightFill);
  }, [highlightIndex, highlightFill]);

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
