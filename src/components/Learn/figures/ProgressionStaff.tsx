"use client";

import { useMemo } from "react";

import { Staff } from "@/components/Learn/figures/Staff";
import { FigureFrame } from "@/components/Learn/figures/FigureFrame";
import { FigurePlayButton } from "@/components/Learn/figures/FigurePlayButton";
import { playProgression } from "@/lib/audio/learnPlayback";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { suggestedKeyForProgression } from "@/utils/slug/progressionSelection";
import { prepareChordProgressionSequence } from "@/utils/SequencePlaybackUtils";
import { StaffUtils } from "@/utils/StaffUtils";

/** A chord progression on the staff the way the app draws it - same chord spelling and key
 * signature - in the given tonic, with its chord names (and optionally Roman numerals) underneath. Meant for short patterns that fit one line; each chord is a whole note. The tonic must be
 * one the progression can legally take (see legalTonicsForProgression). */
export function ProgressionStaff({
  tonic,
  progression,
  caption,
  showRomanNumerals = true,
  bare = false,
  play = false,
}: {
  tonic: string;
  progression: ChordProgressionType;
  caption: string;
  /** Roman numerals above the chord names. */
  showRomanNumerals?: boolean;
  /** Render just the figure - no card, padding or caption - for use as an image. */
  bare?: boolean;
  /** Adds a play button that sounds the progression, each chord for its notated length. */
  play?: boolean;
}) {
  const musicalKey = useMemo(
    () =>
      MusicalKey.fromClassicalMode(tonic, suggestedKeyForProgression(progression).classicalMode),
    [tonic, progression],
  );

  const { romanNumerals, chordNames } = useMemo(() => {
    const formatter = new ChordProgressionFormatter(
      ChordProgressionLibrary.getProgression(progression),
    );
    const tokens = formatter.formatCompactForDisplay(musicalKey).flat();
    const join = (labels: (string | undefined)[]) => labels.filter(Boolean).join(" – ");
    return {
      romanNumerals: join(tokens.map((token) => token.label)),
      chordNames: join(tokens.map((token) => token.absoluteLabel)),
    };
  }, [musicalKey, progression]);

  const keySignature = useMemo(
    () => VexFlowFormatter.getKeySignatureForVex(musicalKey.getStaffSpellingKey()),
    [musicalKey],
  );

  const prepared = useMemo(
    () => prepareChordProgressionSequence(progression, musicalKey),
    [musicalKey, progression],
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

  return (
    <FigureFrame
      bare={bare}
      playControl={
        play ? <FigurePlayButton onStart={(id) => void playProgression(id, prepared)} /> : undefined
      }
      caption={
        <>
          <span>{caption}</span>
          {showRomanNumerals && <span className="font-bold">{romanNumerals}</span>}
          <span>{chordNames}</span>
        </>
      }
    >
      <Staff keySignature={keySignature} steps={steps} voiceTime={`${steps.length}/1`} />
    </FigureFrame>
  );
}
