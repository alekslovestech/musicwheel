"use client";

import { TYPOGRAPHY } from "@/lib/design";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";
import { ScaleRibbonData, ScaleRibbonMark, ScaleRibbonTick } from "@/utils/visual/scaleRibbonUtils";

export function ScaleRibbon({
  ribbon,
  activeNoteIndex = null,
  onSelectStep,
  caption,
  stepAnnotations,
}: {
  ribbon: ScaleRibbonData;
  activeNoteIndex?: number | null;
  /** Selects the degree at this sequence index; omit to render the ribbon read-only. */
  onSelectStep?: (stepIndex: number) => void;
  /** One line naming what this lens holds fixed and what it varies. */
  caption?: string;
  /** W-H annotation control; omit in the lenses where step segments mean nothing. */
  stepAnnotations?: { checked: boolean; onChange: (checked: boolean) => void };
}) {
  return (
    <div id="scale-ribbon" className="flex flex-col gap-tight">
      <div className="flex items-center justify-between gap-snug">
        <div className="text-xs font-medium uppercase tracking-wide text-labels-textDefault opacity-70">
          {ribbon.title}
        </div>
        {stepAnnotations && <StepAnnotationToggle {...stepAnnotations} />}
      </div>

      {ribbon.kind === "ticks" && (
        <StepsRibbonLayout
          notes={ribbon.notes}
          steps={ribbon.steps}
          activeNoteIndex={activeNoteIndex}
          onSelectStep={onSelectStep}
        />
      )}
      {ribbon.kind === "labels" && (
        <LabelsRibbonLayout
          notes={ribbon.notes}
          activeNoteIndex={activeNoteIndex}
          onSelectStep={onSelectStep}
        />
      )}
      {ribbon.kind === "swatches" && (
        <NotesRibbonLayout
          notes={ribbon.notes}
          activeNoteIndex={activeNoteIndex}
          onSelectStep={onSelectStep}
        />
      )}

      {caption && (
        <div
          id="scale-ribbon-caption"
          className="text-center text-[10px] italic leading-tight text-labels-textDefault opacity-60"
        >
          {caption}
        </div>
      )}
    </div>
  );
}

/**
 * A ghost affordance rather than a mode button: W-H is an annotation on the Notes ribbon, and
 * headlining it would put the neighbour-relative frame in front of the two frames that carry the
 * teaching. Available for comparing scale shapes independent of key; not the first thing seen.
 */
function StepAnnotationToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const trackAction = useTrack();

  const handleClick = () => {
    trackAction(TrackEvent.ScaleStepAnnotationsToggled, { show_step_annotations: !checked });
    onChange(!checked);
  };

  return (
    <button
      id="scale-ribbon-step-annotations-toggle"
      type="button"
      aria-pressed={checked}
      onClick={handleClick}
      title="Show the whole- and half-step distance between neighbouring notes"
      className={`shrink-0 rounded border px-tight py-px text-[10px] font-medium uppercase tracking-wide transition-colors ${
        checked
          ? "border-buttons-borderSelected bg-buttons-bgSelected text-buttons-textSelected"
          : "border-containers-divider text-labels-textDefault opacity-70 hover:bg-buttons-bgHover hover:opacity-100"
      }`}
    >
      W–H
    </button>
  );
}

function NotesRibbonLayout({
  notes,
  activeNoteIndex,
  onSelectStep,
}: {
  notes: ScaleRibbonMark[];
  activeNoteIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  // No outer gap: every ribbon layout gives its notes equal-width flex-1 cells with zero gap
  // between them, so a note's horizontal center is always index+0.5 slots across the row. That
  // arithmetic has to hold identically here, in LabelsRibbonLayout, and in the tick cells inside
  // StepsRibbonLayout - it's what lets the connector overlay there compute positions that line up
  // with swatch and label centers with no toggle-dependent drift.
  return (
    <div className="flex items-end">
      {notes.map((note, index) => (
        <RibbonNoteSwatch
          key={`${note.label}-${index}`}
          note={note}
          stepIndex={index}
          isActive={index === activeNoteIndex}
          onSelect={onSelectStep && (() => onSelectStep(index))}
        />
      ))}
    </div>
  );
}

/**
 * The plain baseline: the same tick-and-circle treatment as the W-H view, minus the connector
 * row above it. A single note has no interval to derive a color from, so there's nothing to
 * annotate - but the active step still deserves the same circled callout it gets everywhere
 * else, rather than reverting to flat text the moment W-H is off. Turning W-H on adds the
 * connector row (see StepsRibbonLayout); it doesn't change how a note itself is drawn.
 */
function LabelsRibbonLayout({
  notes,
  activeNoteIndex,
  onSelectStep,
}: {
  notes: ScaleRibbonTick[];
  activeNoteIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  return (
    <NoteTickRow notes={notes} activeNoteIndex={activeNoteIndex} onSelectStep={onSelectStep} />
  );
}

/**
 * Notes sit in equal-width flex-1 cells, exactly like NotesRibbonLayout and LabelsRibbonLayout -
 * that's what makes note i's center land at the same x position in every layout. Connectors
 * can't be additional flex siblings interleaved between notes (that would make this row 2N-1
 * cells instead of N, shrinking every cell and shifting every center relative to the other two
 * layouts); instead they're an absolutely positioned overlay, one per step, each spanning exactly
 * from note index's center to note (index+1)'s center: with N equal zero-gap cells, note k's
 * center sits at (k+0.5)/N of the row's width, so a box positioned at left=(index+0.5)/N with
 * width=1/N starts precisely on one note's center and ends precisely on the next's - no
 * measurement of the actual note row required, only the count.
 *
 * The colored segment isn't given a row of its own: it's pinned to the same top edge the tick
 * marks start from, so it reads as sitting directly between two tick marks rather than as a
 * whole separate block stacked above them. Only the interval label ("W"/"H"/"1½") - now above
 * the segment rather than below it - costs real extra height; the segment itself is free.
 */
function StepsRibbonLayout({
  notes,
  steps,
  activeNoteIndex,
  onSelectStep,
}: {
  notes: ScaleRibbonTick[];
  steps: ScaleRibbonMark[];
  activeNoteIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  const cellWidthPercent = 100 / notes.length;

  return (
    <div className="flex flex-col">
      <div className="relative h-3">
        {steps.map((step, index) => (
          <span
            key={`${step.label}-${index}`}
            className="absolute top-0 text-center text-[10px] font-medium leading-none text-labels-textDefault"
            style={{
              left: `${(index + 0.5) * cellWidthPercent}%`,
              width: `${cellWidthPercent}%`,
            }}
          >
            {step.label}
          </span>
        ))}
      </div>
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
          {steps.map((step, index) => (
            <div
              key={`${step.label}-${index}`}
              className="absolute top-0 h-1 rounded-full"
              style={{
                left: `${(index + 0.5) * cellWidthPercent}%`,
                width: `${cellWidthPercent}%`,
                backgroundColor: step.color.css(),
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <NoteTickRow
            notes={notes}
            activeNoteIndex={activeNoteIndex}
            onSelectStep={onSelectStep}
          />
        </div>
      </div>
    </div>
  );
}

/** The note row shared by LabelsRibbonLayout and StepsRibbonLayout - same ticks either way. */
function NoteTickRow({
  notes,
  activeNoteIndex,
  onSelectStep,
}: {
  notes: ScaleRibbonTick[];
  activeNoteIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  // No outer gap - see the note on NotesRibbonLayout.
  return (
    <div className="flex items-end">
      {notes.map((note, index) => (
        <RibbonNoteTick
          key={`${note.label}-${index}`}
          note={note}
          stepIndex={index}
          isActive={index === activeNoteIndex}
          onSelect={onSelectStep && (() => onSelectStep(index))}
        />
      ))}
    </div>
  );
}

/**
 * Renders as a button only when selectable, so a read-only ribbon exposes no empty control to
 * keyboard or screen-reader users.
 */
function RibbonNoteCell({
  onSelect,
  stepIndex,
  label,
  className,
  children,
}: {
  onSelect?: () => void;
  stepIndex: number;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  // Keyed by position, not label: every ribbon closes on the octave tonic, so the first and last
  // cell always share a label ("C" ... "C", "I" ... "I") and a label-derived id would collide.
  const id = `scale-ribbon-note-${stepIndex}`;
  const trackAction = useTrack();

  if (!onSelect)
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );

  const handleClick = () => {
    // No step index in the payload - what matters is that people click around here at all.
    trackAction(TrackEvent.ScaleRibbonStepInteracted);
    onSelect();
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      aria-label={`Select scale degree ${label}`}
      className={`${className} cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-keys-scaleBoundaryColor`}
    >
      {children}
    </button>
  );
}

function RibbonNoteSwatch({
  note,
  stepIndex,
  isActive,
  onSelect,
}: {
  note: ScaleRibbonMark;
  stepIndex: number;
  isActive: boolean;
  onSelect?: () => void;
}) {
  return (
    <RibbonNoteCell
      onSelect={onSelect}
      stepIndex={stepIndex}
      label={note.label}
      className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
    >
      <div
        className={`h-4 w-4 shrink-0 rounded-sm border border-containers-divider/40 ${
          isActive ? "ring-2 ring-keys-scaleBoundaryColor ring-offset-1" : ""
        }`}
        style={{ backgroundColor: note.color.css() }}
      />
      <span className={`w-full truncate text-center ${TYPOGRAPHY.degreeLabelText}`}>
        {note.label}
      </span>
    </RibbonNoteCell>
  );
}

function RibbonNoteTick({
  note,
  stepIndex,
  isActive,
  onSelect,
}: {
  note: ScaleRibbonTick;
  stepIndex: number;
  isActive: boolean;
  onSelect?: () => void;
}) {
  // Same min-w-0 flex-1 cell as RibbonNoteSwatch and RibbonNoteLabel - a note's center has to
  // land in the same place whether the note holds a swatch, a bare label, or this tick, since
  // that's the position the connector overlay in StepsRibbonLayout is computed against.
  return (
    <RibbonNoteCell
      onSelect={onSelect}
      stepIndex={stepIndex}
      label={note.label}
      className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
    >
      <div
        className={`h-3 shrink-0 rounded-full ${
          isActive ? "w-1 bg-keys-scaleBoundaryColor" : "w-0.5 bg-containers-divider"
        }`}
      />
      <span
        className={`flex h-5 min-w-5 items-center justify-center ${TYPOGRAPHY.degreeLabelText} ${
          isActive ? "rounded-full border-2 border-keys-scaleBoundaryColor" : ""
        }`}
      >
        {note.label}
      </span>
    </RibbonNoteCell>
  );
}
