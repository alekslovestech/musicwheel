import type { Factory } from "vexflow";

import { makeDurated } from "@/types/Durated";
import type { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";
import { VexFlowUtils } from "@/utils/VexFlowUtils";

/** Draws a treble staff of whole-note chords onto a factory's render context. Shared by the
 * StaticStaffFigure component and the promo image script, so both render identically. */
export function drawStaticStaff(
  factory: Factory,
  width: number,
  chords: readonly (readonly NoteWithOctave[])[],
  keySignature?: string,
): void {
  const stave = VexFlowUtils.createStaveForContainer(factory, width);
  stave.addClef("treble");
  if (keySignature) stave.addKeySignature(keySignature);
  stave.setContext(factory.getContext()).draw();
  if (chords.length === 0) return;

  const steps = chords.map((chord) => makeDurated([...chord], 1));
  VexFlowUtils.drawVoice(factory, stave, VexFlowFormatter.createStaveChordNotes(steps, factory), {
    voiceTime: `${chords.length}/1`,
  });
}
