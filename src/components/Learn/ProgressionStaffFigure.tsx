"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import type { Factory } from "vexflow";

import { StaffCanvas } from "@/components/Learn/StaffCanvas";
import { FIGURE_KEY_BORDER, LEARN_STYLES } from "@/lib/design";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import {
  progressionSelectionPath,
  suggestedKeyForProgression,
} from "@/utils/slug/progressionSelection";
import { prepareChordProgressionSequence } from "@/utils/SequencePlaybackUtils";
import { StaffUtils } from "@/utils/StaffUtils";
import { VexFlowUtils } from "@/utils/VexFlowUtils";

/** A chord progression on the staff the way the app draws it - same chord spelling and key
 * signature - in the given tonic, with its chord names (and optionally Roman numerals) underneath and a link to hear it in the
 * app. Meant for short patterns that fit one line; each chord is a whole note. The tonic must be
 * one the progression can legally take (see legalTonicsForProgression). */
export function ProgressionStaffFigure({
  tonic,
  progression,
  caption,
  showRomanNumerals = true,
}: {
  tonic: string;
  progression: ChordProgressionType;
  caption: string;
  /** Roman numerals above the chord names. */
  showRomanNumerals?: boolean;
}) {
  const musicalKey = useMemo(
    () => MusicalKey.fromClassicalMode(tonic, suggestedKeyForProgression(progression).classicalMode),
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

  const draw = useCallback(
    (factory: Factory, width: number) => {
      const spellingKey = musicalKey.getStaffSpellingKey();
      const stave = VexFlowUtils.createStaveForContainer(factory, width);
      stave.addClef("treble").addKeySignature(VexFlowFormatter.getKeySignatureForVex(spellingKey));
      stave.setContext(factory.getContext()).draw();

      const prepared = prepareChordProgressionSequence(progression, musicalKey);
      const steps = StaffUtils.buildDuratedChordStepsForBar(
        prepared,
        prepared.steps.map((_, index) => index),
        spellingKey,
      );
      VexFlowUtils.drawVoice(
        factory,
        stave,
        VexFlowFormatter.createStaveChordNotes(steps, factory),
        { voiceTime: `${steps.length}/1` },
      );
    },
    [musicalKey, progression],
  );

  return (
    <figure className={LEARN_STYLES.figureCard} style={FIGURE_KEY_BORDER}>
      <StaffCanvas draw={draw} />
      <figcaption className={LEARN_STYLES.figureCaption}>
        <span>{caption}</span>
        {showRomanNumerals && <span>{romanNumerals}</span>}
        <span>{chordNames}</span>
        <Link
          href={progressionSelectionPath({ tonic, progression })}
          className={LEARN_STYLES.link}
        >
          Hear it in the app
        </Link>
      </figcaption>
    </figure>
  );
}
