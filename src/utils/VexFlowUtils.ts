import { BoundingBox, type Factory, type RenderContext, type Stave, type StaveNote } from "vexflow";

const CHORD_HIGHLIGHT_PAD_X = 6;
const CHORD_HIGHLIGHT_PAD_Y = 5;

/** Pixels subtracted from container width when justifying a voice. */
const STAFF_JUSTIFY_INSET = 20;

/** Stave position and width relative to the staff canvas container. */
const STAVE_X = 5;
const STAVE_Y = -20;
/** Total horizontal inset (container width minus stave width). */
const STAVE_WIDTH_INSET = 10;

export class VexFlowUtils {
  static createStaveForContainer(factory: Factory, containerWidth: number): Stave {
    return factory.Stave({
      x: STAVE_X,
      y: STAVE_Y,
      width: containerWidth - STAVE_WIDTH_INSET,
    });
  }

  /**
   * Formats and draws a single voice.
   * @param containerWidth staff canvas width (same basis as {@link createStaveForContainer}).
   */
  static drawVoice(factory: Factory, stave: Stave, tickables: StaveNote[], containerWidth: number) {
    VexFlowUtils.drawVoiceWithHighlights(factory, stave, tickables, containerWidth);
  }

  /**
   * Formats a single voice, optionally draws a chord background behind one tick, then draws the voice.
   * @param containerWidth staff canvas width (same basis as {@link createStaveForContainer}).
   */
  static drawVoiceWithHighlights(
    factory: Factory,
    stave: Stave,
    tickables: StaveNote[],
    containerWidth: number,
    backgroundNoteIndex?: number,
    backgroundFill?: string,
  ) {
    const context = factory.getContext();
    if (!context) {
      throw new Error("VexFlowUtils.drawVoice: Factory has no render context");
    }
    const justifyWidth = containerWidth - STAFF_JUSTIFY_INSET;
    /** Common time; each {@link StaveNote} carries duration and optional `dots` for rhythm. */
    const voice = factory.Voice({ time: "4/4" });
    voice.setStrict(false);
    voice.addTickables(tickables);
    const softmaxFactor = Math.max(2, 100 / tickables.length);
    factory.Formatter({ softmaxFactor }).joinVoices([voice]).format([voice], justifyWidth, { context, stave });

    if (backgroundFill && backgroundNoteIndex != null && backgroundNoteIndex >= 0) {
      const n = tickables[backgroundNoteIndex];
      if (n) VexFlowUtils.drawActiveChordBackground(context, n, backgroundFill);
    }

    voice.draw(context, stave);
  }

  private static getStaveNoteHighlightBoundingBox(note: StaveNote): BoundingBox | null {
    const m = note.getMetrics();
    const x0 = note.getAbsoluteX() - (m.modLeftPx + m.leftDisplacedHeadPx);
    const w =
      m.notePx + m.rightDisplacedHeadPx + m.modRightPx + m.modLeftPx + m.leftDisplacedHeadPx;
    const box = note.getBoundingBox();
    if (!box) return null;
    return new BoundingBox(
      x0 - CHORD_HIGHLIGHT_PAD_X,
      box.y - CHORD_HIGHLIGHT_PAD_Y,
      w + 2 * CHORD_HIGHLIGHT_PAD_X,
      box.h + 2 * CHORD_HIGHLIGHT_PAD_Y,
    );
  }

  private static drawActiveChordBackground(context: RenderContext, note: StaveNote, fill: string) {
    const rect = this.getStaveNoteHighlightBoundingBox(note);
    if (!rect) return;
    context.save();
    context.setFillStyle(fill);
    context.fillRect(rect.x, rect.y, rect.w, rect.h);
    context.restore();
  }
}
