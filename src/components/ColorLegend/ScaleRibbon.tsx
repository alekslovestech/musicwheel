"use client";

import { Fragment } from "react";

import { ScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";

export function ScaleRibbon({
  ribbon,
  activeNoteIndex = null,
  onSelectStep,
}: {
  ribbon: ScaleRibbonData;
  activeNoteIndex?: number | null;
  /** Selects the degree at this sequence index; omit to render the ribbon read-only. */
  onSelectStep?: (stepIndex: number) => void;
}) {
  const hasSteps = ribbon.steps.length > 0;

  return (
    <div id="scale-ribbon" className="flex flex-col gap-tight">
      <div className="text-xs font-medium uppercase tracking-wide text-labels-textDefault opacity-70">
        {ribbon.title}
      </div>

      {hasSteps ? (
        <StepsRibbonLayout
          notes={ribbon.notes}
          steps={ribbon.steps}
          activeNoteIndex={activeNoteIndex}
          onSelectStep={onSelectStep}
        />
      ) : (
        <NotesRibbonLayout
          notes={ribbon.notes}
          activeNoteIndex={activeNoteIndex}
          onSelectStep={onSelectStep}
        />
      )}
    </div>
  );
}

function NotesRibbonLayout({
  notes,
  activeNoteIndex,
  onSelectStep,
}: {
  notes: ScaleRibbonData["notes"];
  activeNoteIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  return (
    <div className="flex items-end gap-0.5">
      {notes.map((note, index) => (
        <RibbonNoteSwatch
          key={`${note.label}-${index}`}
          note={note}
          isActive={index === activeNoteIndex}
          onSelect={onSelectStep && (() => onSelectStep(index))}
        />
      ))}
    </div>
  );
}

function StepsRibbonLayout({
  notes,
  steps,
  activeNoteIndex,
  onSelectStep,
}: {
  notes: ScaleRibbonData["notes"];
  steps: ScaleRibbonData["steps"];
  activeNoteIndex: number | null;
  onSelectStep?: (stepIndex: number) => void;
}) {
  return (
    <div className="flex items-end">
      {notes.map((note, index) => (
        <Fragment key={`${note.label}-${index}`}>
          <RibbonNoteTick
            note={note}
            isActive={index === activeNoteIndex}
            onSelect={onSelectStep && (() => onSelectStep(index))}
          />
          {/* Connectors are the gaps between degrees, not degrees - nothing to select. */}
          {index < steps.length && <RibbonStepConnector step={steps[index]!} />}
        </Fragment>
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
  label,
  className,
  children,
}: {
  onSelect?: () => void;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  if (!onSelect) return <div className={className}>{children}</div>;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Select scale degree ${label}`}
      className={`${className} cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-keys-scaleBoundaryColor`}
    >
      {children}
    </button>
  );
}

function RibbonNoteSwatch({
  note,
  isActive,
  onSelect,
}: {
  note: ScaleRibbonData["notes"][number];
  isActive: boolean;
  onSelect?: () => void;
}) {
  return (
    <RibbonNoteCell
      onSelect={onSelect}
      label={note.label}
      className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
    >
      <div
        className={`h-4 w-4 shrink-0 rounded-sm border border-containers-divider/40 ${
          isActive ? "ring-2 ring-keys-scaleBoundaryColor ring-offset-1" : ""
        }`}
        style={{ backgroundColor: note.color?.css() ?? "transparent" }}
      />
      <span className="w-full truncate text-center text-[9px] leading-none text-labels-textDefault opacity-60">
        {note.label}
      </span>
    </RibbonNoteCell>
  );
}

function RibbonNoteTick({
  note,
  isActive,
  onSelect,
}: {
  note: ScaleRibbonData["notes"][number];
  isActive: boolean;
  onSelect?: () => void;
}) {
  return (
    <RibbonNoteCell
      onSelect={onSelect}
      label={note.label}
      className="flex shrink-0 flex-col items-center gap-0.5"
    >
      <div
        className={`h-3 shrink-0 ${
          isActive ? "w-0.5 bg-keys-scaleBoundaryColor" : "w-px bg-containers-divider"
        }`}
      />
      <span
        className={`flex h-4 min-w-4 items-center justify-center text-[10px] leading-none text-labels-textDefault ${
          isActive ? "rounded-full border-2 border-keys-scaleBoundaryColor" : ""
        }`}
      >
        {note.label}
      </span>
    </RibbonNoteCell>
  );
}

function RibbonStepConnector({ step }: { step: ScaleRibbonData["steps"][number] }) {
  return (
    <div className="mb-3 flex min-w-0 flex-1 flex-col items-center gap-0.5">
      <div
        className="h-1 w-full min-w-[8px] rounded-full"
        style={{ backgroundColor: step.color.css() }}
      />
      <span className="text-[10px] font-medium leading-none text-labels-textDefault">
        {step.label}
      </span>
    </div>
  );
}
