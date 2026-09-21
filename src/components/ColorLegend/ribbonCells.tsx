"use client";

import { RIBBON_STYLES } from "@/lib/design";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";
import { TWELVE } from "@/types/constants/NoteConstants";

/** A cell's derived active/select state, computed once per row from its index. */
export type RibbonCellProps = { isActive: boolean; onSelect?: () => void };

export function ribbonCellProps(
  index: number,
  activeDegreeIndex: number | null,
  onSelectStep?: (stepIndex: number) => void,
): RibbonCellProps {
  return {
    isActive: index === activeDegreeIndex,
    onSelect: onSelectStep && (() => onSelectStep(index)),
  };
}

/** Shared shape of NotesRibbonLayout/NoteTickRow: map `items` to cells, deriving each cell's
 *  active/select state from its index. `renderItem` owns the per-item markup and its key. */
export function RibbonRow<T>({
  items,
  className,
  activeDegreeIndex,
  onSelectStep,
  renderItem,
}: {
  items: T[];
  className: string;
  activeDegreeIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
  renderItem: (item: T, index: number, cellProps: RibbonCellProps) => React.ReactNode;
}) {
  return (
    <div className={className}>
      {items.map((item, index) =>
        renderItem(item, index, ribbonCellProps(index, activeDegreeIndex, onSelectStep)),
      )}
    </div>
  );
}

/** A chromatic offset (0-12 semitones from the tonic) as a percentage of the ribbon's full span. */
export function chromaticPercent(offset: number): number {
  return (offset / TWELVE) * 100;
}

/**
 * Renders as a button only when selectable, so a read-only ribbon exposes no empty control to
 * keyboard or screen-reader users. The interactive branch is its own component, not an inline
 * conditional, so useTrack() (and the music/audio contexts it reads) is only ever called when
 * onSelect is actually given - a read-only ribbon can render outside those providers entirely,
 * e.g. in a static article figure.
 */
export function RibbonNoteCell({
  onSelect,
  stepIndex,
  label,
  className,
  style,
  children,
}: {
  onSelect?: () => void;
  stepIndex: number;
  label: string;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  // Keyed by position, not label: every ribbon closes on the octave tonic, so the first and last
  // cell always share a label ("C" ... "C", "I" ... "I") and a label-derived id would collide.
  const id = `scale-ribbon-note-${stepIndex}`;

  if (!onSelect)
    return (
      <div id={id} className={className} style={style}>
        {children}
      </div>
    );

  return (
    <InteractiveRibbonNoteCell
      id={id}
      onSelect={onSelect}
      label={label}
      className={className}
      style={style}
    >
      {children}
    </InteractiveRibbonNoteCell>
  );
}

function InteractiveRibbonNoteCell({
  id,
  onSelect,
  label,
  className,
  style,
  children,
}: {
  id: string;
  onSelect: () => void;
  label: string;
  className: string;
  style?: React.CSSProperties;
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
      style={style}
    >
      {children}
    </button>
  );
}
