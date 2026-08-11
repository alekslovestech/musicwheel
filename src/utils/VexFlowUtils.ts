import { BoundingBox, SVGContext, type Factory, type RenderContext, type Stave, type StaveNote } from "vexflow";

const CHORD_HIGHLIGHT_PAD_X = 6;
const CHORD_HIGHLIGHT_PAD_Y = 5;

/** Stave position and width relative to the staff canvas container. */
const STAVE_X = 2;
const STAVE_Y = -20;
/** Total horizontal inset (container width minus stave width). */
const STAVE_WIDTH_INSET = 4;

/** Extra space reserved past the last notehead for stem tails, augmentation dots, etc. */
const TRAILING_NOTE_PADDING = 12;

/** 1 = uniform spacing (duration ignored); lower than 2 rebalances dense bars more aggressively. */
const SOFTMAX_FACTOR = 1;

export type VexFlowDrawVoiceOptions = {
  /** VexFlow voice meter; defaults to common time. */
  voiceTime?: string;
  /** Hide stems after formatting (e.g. scale-degree survey without rhythmic emphasis). */
  stemless?: boolean;
};

export class VexFlowUtils {
  static createStaveForContainer(factory: Factory, containerWidth: number): Stave {
    return factory.Stave({
      x: STAVE_X,
      y: STAVE_Y,
      width: containerWidth - STAVE_WIDTH_INSET,
    });
  }

  /**
   * Formats and draws a single voice, returning the highlight box of each tick so a caller can
   * drive a {@link StaffHighlightOverlay} without re-running this layout pass.
   */
  static drawVoice(
    factory: Factory,
    stave: Stave,
    tickables: StaveNote[],
    options?: VexFlowDrawVoiceOptions,
  ): (BoundingBox | null)[] {
    const context = factory.getContext();
    if (!context) {
      throw new Error("VexFlowUtils.drawVoice: Factory has no render context");
    }
    /** Common time; each {@link StaveNote} carries duration and optional `dots` for rhythm. */
    const voice = factory.Voice({ time: options?.voiceTime ?? "4/4" });
    voice.setStrict(false);
    voice.addTickables(tickables);
    VexFlowUtils.formatVoiceToStave(factory, voice, stave, context);
    if (options?.stemless) {
      VexFlowUtils.hideStems(tickables);
    }
    VexFlowUtils.enforceTrailingPadding(stave, tickables);

    // After formatting, before drawing: positions are final here, and every subsequent highlight
    // move is then a handful of attribute writes instead of another layout.
    const highlightBoxes = tickables.map((note) =>
      VexFlowUtils.getStaveNoteHighlightBoundingBox(note),
    );

    voice.draw(context, stave);
    return highlightBoxes;
  }

  /** Stave-aware justification; trailing padding enforced after format via {@link enforceTrailingPadding}. */
  private static formatVoiceToStave(
    factory: Factory,
    voice: ReturnType<Factory["Voice"]>,
    stave: Stave,
    context: RenderContext,
  ) {
    factory.Formatter({ softmaxFactor: SOFTMAX_FACTOR })
      .joinVoices([voice])
      .formatToStave([voice], stave, { context });
  }

  /** Nudge notes left when formatting still leaves the last chord's tail past the stave end. */
  private static enforceTrailingPadding(stave: Stave, tickables: StaveNote[]) {
    if (tickables.length === 0) return;
    const last = tickables[tickables.length - 1];
    const rightEdge = VexFlowUtils.getStaveNoteRightEdge(last);
    const maxRight = stave.getNoteEndX() - TRAILING_NOTE_PADDING;
    if (rightEdge <= maxRight) return;

    const shift = rightEdge - maxRight;
    for (const note of tickables) {
      note.setX(note.getX() - shift);
    }
  }

  private static hideStems(tickables: StaveNote[]) {
    for (const note of tickables) {
      note.getStem()?.setVisibility(false);
    }
  }

  private static getStaveNoteRightEdge(note: StaveNote): number {
    const m = note.getMetrics();
    return note.getAbsoluteX() + m.notePx + m.rightDisplacedHeadPx + m.modRightPx;
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

}

/**
 * The active-step background, as one reusable `<rect>` behind the score.
 *
 * Playback moves this highlight several times per second. Redrawing the score to move it costs a
 * full VexFlow layout pass, and that cost - being variable on slower devices - is what shows up
 * as uneven timing. Repositioning one element instead keeps the per-step render cost flat.
 */
export class StaffHighlightOverlay {
  private constructor(
    private readonly rect: SVGRectElement,
    private readonly boxes: readonly (BoundingBox | null)[],
  ) {}

  /** Null for non-SVG backends, which have no element to reposition. */
  static create(
    context: RenderContext,
    highlightBoxes: readonly (BoundingBox | null)[],
  ): StaffHighlightOverlay | null {
    if (!(context instanceof SVGContext)) return null;

    const rect = context.create("rect");
    rect.setAttribute("stroke", "none");
    rect.setAttribute("visibility", "hidden");
    // First child of the root svg: VexFlow scales via viewBox rather than a group transform, so
    // this shares the score's coordinate space, and document order puts it behind the notes.
    context.svg.insertBefore(rect, context.svg.firstChild);

    return new StaffHighlightOverlay(rect, highlightBoxes);
  }

  /** Hides the highlight when the index is absent, out of range, or has no fill. */
  apply(index: number | null | undefined, fill: string | undefined) {
    const box = index == null || index < 0 ? null : this.boxes[index];
    if (!box || !fill) {
      this.rect.setAttribute("visibility", "hidden");
      return;
    }

    this.rect.setAttribute("x", String(box.x));
    this.rect.setAttribute("y", String(box.y));
    this.rect.setAttribute("width", String(box.w));
    this.rect.setAttribute("height", String(box.h));
    this.rect.setAttribute("fill", fill);
    this.rect.setAttribute("visibility", "visible");
  }
}
