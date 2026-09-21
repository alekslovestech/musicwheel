"use client";

import { ColorSwatch } from "@/components/ColorLegend/ColorSwatch";
import { chromaticPercent, RibbonNoteCell, RibbonRow } from "@/components/ColorLegend/ribbonCells";
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
  showTitle = true,
}: {
  ribbon: ScaleRibbonData;
  activeDegreeIndex?: number | null;
  /** Selects the degree at this sequence index; omit to render the ribbon read-only. */
  onSelectStep?: (stepIndex: number) => void;
  /** One line naming what this lens holds fixed and what it varies. */
  caption?: string;
  /** Gaps annotation control; omit in the lenses where step segments mean nothing. */
  stepAnnotations?: { checked: boolean; onChange: (checked: boolean) => void };
  /** Names which lens (Notes/Drone/Triads/Sevenths) this ribbon is - only meaningful where the
   * lens can change, e.g. SequenceLegendPanel. A figure that only ever shows one static ribbon
   * has nothing for the title to disambiguate. */
  showTitle?: boolean;
}) {
  return (
    <div id="scale-ribbon" className="flex flex-col gap-tight">
      {(showTitle || stepAnnotations) && (
        <div className="flex items-center justify-between gap-snug">
          {showTitle && <div className={RIBBON_STYLES.title}>{ribbon.title}</div>}
          {stepAnnotations && <StepAnnotationToggle {...stepAnnotations} />}
        </div>
      )}

      {ribbon.kind === "labels" && (
        <LabelsRibbonLayout
          notes={ribbon.notes}
          steps={ribbon.steps}
          offsets={ribbon.offsets}
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
      title="Show the semitone gap between neighboring notes"
      className={`${RIBBON_STYLES.annotationToggle} ${
        checked ? RIBBON_STYLES.annotationToggleActive : RIBBON_STYLES.annotationToggleInactive
      }`}
    >
      Gaps
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
    <RibbonRow
      items={notes}
      className={RIBBON_STYLES.noteRow}
      activeDegreeIndex={activeDegreeIndex}
      onSelectStep={onSelectStep}
      renderItem={(note, index, cellProps) => (
        <RibbonNoteSwatch
          key={`${note.label}-${index}`}
          note={note}
          stepIndex={index}
          {...cellProps}
        />
      )}
    />
  );
}

/** A ribbon note paired with its chromatic position, 0-12 semitones from the tonic. */
type NoteTick = { label: string; offset: number };

/**
 * Bare tick-and-circle notes, spaced by real semitone distance from the tonic rather than by
 * index, plus an optional connector overlay when steps are given. Both the ticks and the
 * connectors are positioned from the same `offsets` array, so a step's bar always spans exactly
 * from one note's position to the next's.
 */
function LabelsRibbonLayout({
  notes,
  steps,
  offsets,
  activeDegreeIndex,
  onSelectStep,
}: {
  notes: string[];
  steps?: LabelWithColor[];
  offsets: number[];
  activeDegreeIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  const ticks: NoteTick[] = notes.map((label, i) => ({ label, offset: offsets[i] }));

  if (!steps) {
    return (
      <NoteTickRow
        ticks={ticks}
        activeDegreeIndex={activeDegreeIndex}
        onSelectStep={onSelectStep}
      />
    );
  }

  return (
    <div className="relative">
      <div aria-hidden className={RIBBON_STYLES.connectorOverlay}>
        {steps.map((step, index) => {
          const left = chromaticPercent(offsets[index]);
          const width = chromaticPercent(offsets[index + 1] - offsets[index]);
          return (
            <div
              key={`${step.label}-${index}`}
              className={RIBBON_STYLES.connectorBar}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: step.color.css(),
              }}
            />
          );
        })}
      </div>
      <div className="relative z-10">
        <NoteTickRow
          ticks={ticks}
          activeDegreeIndex={activeDegreeIndex}
          onSelectStep={onSelectStep}
        />
      </div>
    </div>
  );
}

function NoteTickRow({
  ticks,
  activeDegreeIndex,
  onSelectStep,
}: {
  ticks: NoteTick[];
  activeDegreeIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  return (
    <RibbonRow
      items={ticks}
      className={RIBBON_STYLES.noteRowProportional}
      activeDegreeIndex={activeDegreeIndex}
      onSelectStep={onSelectStep}
      renderItem={(tick, index, cellProps) => (
        <RibbonNoteTick
          key={`${tick.label}-${index}`}
          label={tick.label}
          stepIndex={index}
          style={{ left: `${chromaticPercent(tick.offset)}%` }}
          {...cellProps}
        />
      )}
    />
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
  style,
}: {
  label: string;
  stepIndex: number;
  isActive: boolean;
  onSelect?: () => void;
  style: React.CSSProperties;
}) {
  return (
    <RibbonNoteCell
      onSelect={onSelect}
      stepIndex={stepIndex}
      label={label}
      className={RIBBON_STYLES.noteCellAbsolute}
      style={style}
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
