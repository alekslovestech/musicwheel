"use client";

import { Fragment } from "react";

import { ScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";

export function ScaleRibbon({
  ribbon,
  activeNoteIndex = null,
}: {
  ribbon: ScaleRibbonData;
  activeNoteIndex?: number | null;
}) {
  const hasSteps = ribbon.steps.length > 0;

  return (
    <div id="scale-ribbon" className="flex flex-col gap-tight">
      <div className="text-xs font-medium uppercase tracking-wide text-labels-textDefault opacity-70">
        {ribbon.title}
      </div>

      {hasSteps ? (
        <StepsRibbonLayout notes={ribbon.notes} steps={ribbon.steps} activeNoteIndex={activeNoteIndex} />
      ) : (
        <NotesRibbonLayout notes={ribbon.notes} activeNoteIndex={activeNoteIndex} />
      )}
    </div>
  );
}

function NotesRibbonLayout({
  notes,
  activeNoteIndex,
}: {
  notes: ScaleRibbonData["notes"];
  activeNoteIndex: number | null;
}) {
  return (
    <div className="flex items-end gap-0.5">
      {notes.map((note, index) => (
        <RibbonNoteSwatch
          key={`${note.label}-${index}`}
          note={note}
          isActive={index === activeNoteIndex}
        />
      ))}
    </div>
  );
}

function StepsRibbonLayout({
  notes,
  steps,
  activeNoteIndex,
}: {
  notes: ScaleRibbonData["notes"];
  steps: ScaleRibbonData["steps"];
  activeNoteIndex: number | null;
}) {
  return (
    <div className="flex items-end">
      {notes.map((note, index) => (
        <Fragment key={`${note.label}-${index}`}>
          <RibbonNoteTick note={note} isActive={index === activeNoteIndex} />
          {index < steps.length && <RibbonStepConnector step={steps[index]!} />}
        </Fragment>
      ))}
    </div>
  );
}

function RibbonNoteSwatch({
  note,
  isActive,
}: {
  note: ScaleRibbonData["notes"][number];
  isActive: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
      <div
        className={`h-4 w-4 shrink-0 rounded-sm border border-containers-divider/40 ${
          isActive ? "ring-2 ring-keys-scaleBoundaryColor ring-offset-1" : ""
        }`}
        style={{ backgroundColor: note.color?.css() ?? "transparent" }}
      />
      <span className="text-[10px] leading-none text-labels-textDefault">{note.label}</span>
    </div>
  );
}

function RibbonNoteTick({
  note,
  isActive,
}: {
  note: ScaleRibbonData["notes"][number];
  isActive: boolean;
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5">
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
    </div>
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
