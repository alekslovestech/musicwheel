"use client";

import { Fragment, useMemo, useState } from "react";

import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { FigureFrame } from "@/components/Learn/figures/FigureFrame";
import { FigurePlayButton } from "@/components/Learn/figures/FigurePlayButton";
import { Staff } from "@/components/Learn/figures/Staff";
import { playProgression } from "@/lib/audio/learnPlayback";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { actualToChromatic, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { prepareChordProgressionSequence } from "@/utils/SequencePlaybackUtils";
import { suggestedKeyForProgression } from "@/utils/slug/progressionSelection";
import { StaffUtils } from "@/utils/StaffUtils";
import { chordActiveHighlightFor } from "@/utils/visual/NoteGroupingColorRegistry";

/** The parts a progression figure can show. */
type ProgressionView = "staff" | "wheel" | "linear";

const DEFAULT_VIEWS: readonly ProgressionView[] = ["staff", "wheel"];

// One chord progression as a sequence: its staff (with Roman numerals and chord names) over a
// single wheel and/or linear keyboard that show the current chord. Idle, they show the first
// chord; while the play button's run is going, the staff highlights and the keyboards follow the
// chord now sounding, then return to the first chord when it ends. The tonic must be one the
// progression can legally take (see legalTonicsForProgression).
export function ProgressionFigure({
  tonic,
  progression,
  caption,
  views = DEFAULT_VIEWS,
  showRomanNumerals = true,
  isCompact = false,
  bare = false,
  narrow = true,
  play = true,
}: {
  tonic: string;
  progression: ChordProgressionType;
  caption: string;
  // Which parts to show, top to bottom.
  views?: readonly ProgressionView[];
  // Roman numerals above the chord names in the caption.
  showRomanNumerals?: boolean;
  // Single-octave linear keyboard starting on C; see LinearKeyboardView.isCompact.
  isCompact?: boolean;
  // Render just the figure - no card, padding or caption - for use as an image.
  bare?: boolean;
  // A narrower, centered figure; set false for the full article width.
  narrow?: boolean;
  // Shows a play button that sounds the progression, following each chord as it plays; set
  // false for a silent figure.
  play?: boolean;
}) {
  const musicalKey = useMemo(
    () =>
      MusicalKey.fromClassicalMode(tonic, suggestedKeyForProgression(progression).classicalMode),
    [tonic, progression],
  );
  // The chord now sounding, while the play button's run is going; null otherwise.
  const [playing, setPlaying] = useState<{ step: number; notes: NoteIndices } | null>(null);

  const chords = useMemo(() => ChordProgressionLibrary.getProgression(progression), [progression]);
  const prepared = useMemo(
    () => prepareChordProgressionSequence(progression, musicalKey),
    [musicalKey, progression],
  );

  const { romanNumerals, chordNames } = useMemo(() => {
    const tokens = new ChordProgressionFormatter(chords).formatCompactForDisplay(musicalKey).flat();
    const join = (labels: (string | undefined)[]) => labels.filter(Boolean).join(" – ");
    return {
      romanNumerals: join(tokens.map((token) => token.label)),
      chordNames: join(tokens.map((token) => token.absoluteLabel)),
    };
  }, [chords, musicalKey]);

  const keySignature = useMemo(
    () => VexFlowFormatter.getKeySignatureForVex(musicalKey.getStaffSpellingKey()),
    [musicalKey],
  );
  const steps = useMemo(
    () =>
      StaffUtils.buildDuratedChordStepsForBar(
        prepared,
        prepared.steps.map((_, index) => index),
        musicalKey.getStaffSpellingKey(),
      ),
    [prepared, musicalKey],
  );

  const shownNotes = playing?.notes ?? prepared.steps[0]?.value;
  const activeFill = playing
    ? chordActiveHighlightFor(chords.progression[playing.step]?.value.chordType).css()
    : undefined;

  function renderView(view: ProgressionView) {
    switch (view) {
      case "staff":
        return (
          <Staff
            keySignature={keySignature}
            steps={steps}
            voiceTime={`${steps.length}/1`}
            activeIndex={playing?.step ?? null}
            activeFill={activeFill}
          />
        );
      case "wheel":
        return (
          <CircularKeyboardView
            musicalKey={musicalKey}
            highlightedNoteIndices={shownNotes}
            isScales={false}
            onKeyClick={null}
          />
        );
      case "linear":
        return (
          <LinearKeyboardView
            musicalKey={musicalKey}
            highlightedNoteIndices={shownNotes}
            isScales={false}
            onKeyClick={null}
            isBassNote={(actualIndex) => actualToChromatic(actualIndex) === musicalKey.tonicIndex}
            isCompact={isCompact}
          />
        );
    }
  }

  return (
    <FigureFrame
      bare={bare}
      narrow={narrow}
      playControl={
        play ? (
          <FigurePlayButton
            onStart={(id) =>
              void playProgression(
                id,
                prepared,
                (step, notes) => setPlaying({ step, notes }),
                () => setPlaying(null),
              )
            }
          />
        ) : undefined
      }
      caption={
        <>
          <span>{caption}</span>
          {showRomanNumerals && <span className="font-bold">{romanNumerals}</span>}
          <span>{chordNames}</span>
        </>
      }
    >
      {views.map((view) => (
        <Fragment key={view}>{renderView(view)}</Fragment>
      ))}
    </FigureFrame>
  );
}
