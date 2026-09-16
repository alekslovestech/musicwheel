"use client";

import { ColorSwatch } from "@/components/ColorLegend/ColorSwatch";
import { RIBBON_STYLES, TYPOGRAPHY } from "@/lib/design";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";
import { LabelWithColor, ScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";

export function ScaleRibbon({
  ribbon,
  activeDegreeIndex = null,
  onSelectStep,
  caption,
  stepAnnotations,
}: {
  ribbon: ScaleRibbonData;
  activeDegreeIndex?: number | null;
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
        <div className={RIBBON_STYLES.title}>{ribbon.title}</div>
        {stepAnnotations && <StepAnnotationToggle {...stepAnnotations} />}
      </div>

      {ribbon.kind === "labels" && (
        <LabelsRibbonLayout
          notes={ribbon.notes}
          steps={ribbon.steps}
          activeDegreeIndex={activeDegreeIndex}
          onSelectStep={onSelectStep}
        />
      )}
      {ribbon.kind === "swatches" && (
        <NotesRibbonLayout
          notes={ribbon.notes}
          activeDegreeIndex={activeDegreeIndex}
          onSelectStep={onSelectStep}
        />
      )}

      {caption && (
        <div id="scale-ribbon-caption" className={RIBBON_STYLES.caption}>
          {caption}
        </div>
      )}
    </div>
  );
}

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
      className={`${RIBBON_STYLES.annotationToggle} ${
        checked ? RIBBON_STYLES.annotationToggleActive : RIBBON_STYLES.annotationToggleInactive
      }`}
    >
      W–H
    </button>
  );
}

function NotesRibbonLayout({
  notes,
  activeDegreeIndex,
  onSelectStep,
}: {
  notes: LabelWithColor[];
  activeDegreeIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  // No outer gap - every layout uses equal-width flex-1 cells with zero gap, so a note's center
  // is always at index+0.5 slots. See LabelsRibbonLayout, which depends on that being exact.
  return (
    <div className={RIBBON_STYLES.noteRow}>
      {notes.map((note, index) => (
        <RibbonNoteSwatch
          key={`${note.label}-${index}`}
          note={note}
          stepIndex={index}
          isActive={index === activeDegreeIndex}
          onSelect={onSelectStep && (() => onSelectStep(index))}
        />
      ))}
    </div>
  );
}

/**
 * Bare tick-and-circle notes, same treatment as the W-H view, plus an optional connector overlay
 * when steps are given. Connectors can't be flex siblings interleaved between notes - that would
 * make the note row 2N-1 cells instead of N and shift every center relative to the other layouts
 * (NotesRibbonLayout). Instead each is an absolute box at left=(index+0.5)/N, width=1/N: with N
 * equal zero-gap cells, that starts exactly on one note's center and ends exactly on the next's.
 * It's pinned to the same top edge the tick marks start from rather than given a row of its own,
 * so only the interval label above it costs real height.
 */
function LabelsRibbonLayout({
  notes,
  steps,
  activeDegreeIndex,
  onSelectStep,
}: {
  notes: string[];
  steps?: LabelWithColor[];
  activeDegreeIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  if (!steps) {
    return (
      <NoteTickRow
        notes={notes}
        activeDegreeIndex={activeDegreeIndex}
        onSelectStep={onSelectStep}
      />
    );
  }

  const cellWidthPercent = 100 / notes.length;

  return (
    <div className="flex flex-col">
      <div className="relative h-3">
        {steps.map((step, index) => (
          <span
            key={`${step.label}-${index}`}
            className={RIBBON_STYLES.stepLabel}
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
        <div aria-hidden className={RIBBON_STYLES.connectorOverlay}>
          {steps.map((step, index) => (
            <div
              key={`${step.label}-${index}`}
              className={RIBBON_STYLES.connectorBar}
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
            activeDegreeIndex={activeDegreeIndex}
            onSelectStep={onSelectStep}
          />
        </div>
      </div>
    </div>
  );
}

function NoteTickRow({
  notes,
  activeDegreeIndex,
  onSelectStep,
}: {
  notes: string[];
  activeDegreeIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  return (
    <div className={RIBBON_STYLES.noteRow}>
      {notes.map((label, index) => (
        <RibbonNoteTick
          key={`${label}-${index}`}
          label={label}
          stepIndex={index}
          isActive={index === activeDegreeIndex}
          onSelect={onSelectStep && (() => onSelectStep(index))}
        />
      ))}
    </div>
  );
}

/**
 * Renders as a button only when selectable, so a read-only ribbon exposes no empty control to
 * keyboard or screen-reader users. The interactive branch is its own component, not an inline
 * conditional, so useTrack() (and the music/audio contexts it reads) is only ever called when
 * onSelect is actually given - a read-only ribbon can render outside those providers entirely,
 * e.g. in a static article figure.
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

  if (!onSelect)
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );

  return (
    <InteractiveRibbonNoteCell id={id} onSelect={onSelect} label={label} className={className}>
      {children}
    </InteractiveRibbonNoteCell>
  );
}

function InteractiveRibbonNoteCell({
  id,
  onSelect,
  label,
  className,
  children,
}: {
  id: string;
  onSelect: () => void;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  const trackAction = useTrack();

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
      className={`${className} ${RIBBON_STYLES.interactiveCell}`}
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
  note: LabelWithColor;
  stepIndex: number;
  isActive: boolean;
  onSelect?: () => void;
}) {
  return (
    <RibbonNoteCell
      onSelect={onSelect}
      stepIndex={stepIndex}
      label={note.label}
      className={RIBBON_STYLES.noteCell}
    >
      <ColorSwatch color={note.color} isActive={isActive} />
      <span className={`w-full truncate text-center ${TYPOGRAPHY.degreeLabelText}`}>
        {note.label}
      </span>
    </RibbonNoteCell>
  );
}

function RibbonNoteTick({
  label,
  stepIndex,
  isActive,
  onSelect,
}: {
  label: string;
  stepIndex: number;
  isActive: boolean;
  onSelect?: () => void;
}) {
  // Same min-w-0 flex-1 cell as RibbonNoteSwatch - centers must match across layouts.
  return (
    <RibbonNoteCell
      onSelect={onSelect}
      stepIndex={stepIndex}
      label={label}
      className={RIBBON_STYLES.noteCell}
    >
      <div
        className={`${RIBBON_STYLES.tickMark} ${
          isActive ? RIBBON_STYLES.tickMarkActive : RIBBON_STYLES.tickMarkInactive
        }`}
      />
      <span
        className={`${RIBBON_STYLES.tickLabel} ${TYPOGRAPHY.degreeLabelText} ${
          isActive ? RIBBON_STYLES.tickLabelActive : ""
        }`}
      >
        {label}
      </span>
    </RibbonNoteCell>
  );
}
