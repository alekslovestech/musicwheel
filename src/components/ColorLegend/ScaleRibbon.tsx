"use client";

import { ScaleRibbonData } from "@/utils/visual/scaleRibbonUtils";

export function ScaleRibbon({ ribbon }: { ribbon: ScaleRibbonData }) {
  const hasSteps = ribbon.steps.length > 0;

  return (
    <div id="scale-ribbon" className="flex flex-col gap-tight">
      <div className="text-xs font-medium uppercase tracking-wide text-labels-textDefault opacity-70">
        {ribbon.title}
      </div>

      {hasSteps ? (
        <StepsRibbonLayout notes={ribbon.notes} steps={ribbon.steps} />
      ) : (
        <NotesRibbonLayout notes={ribbon.notes} />
      )}

      {hasSteps && <StepLegendHint />}
    </div>
  );
}

function NotesRibbonLayout({ notes }: { notes: ScaleRibbonData["notes"] }) {
  return (
    <div className="flex items-end gap-0.5">
      {notes.map((note, index) => (
        <RibbonNoteSwatch key={`${note.label}-${index}`} note={note} />
      ))}
    </div>
  );
}

function StepsRibbonLayout({
  notes,
  steps,
}: {
  notes: ScaleRibbonData["notes"];
  steps: ScaleRibbonData["steps"];
}) {
  return (
    <div className="flex items-end">
      {notes.map((note, index) => (
        <div key={`${note.label}-${index}`} className="flex min-w-0 flex-1 items-end">
          <RibbonNoteSwatch note={note} compact />
          {index < steps.length && <RibbonStepConnector step={steps[index]!} />}
        </div>
      ))}
    </div>
  );
}

function RibbonNoteSwatch({
  note,
  compact = false,
}: {
  note: ScaleRibbonData["notes"][number];
  compact?: boolean;
}) {
  const swatchSize = compact ? "h-3 w-3" : "h-4 w-4";
  const borderClass = note.isTonic ? "ring-2 ring-keys-scaleBoundaryColor ring-offset-1" : "";

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
      <div
        className={`${swatchSize} shrink-0 rounded-sm border border-containers-divider/40 ${borderClass}`}
        style={{ backgroundColor: note.color?.css() ?? "transparent" }}
      />
      <span className="text-[10px] leading-none text-labels-textDefault">{note.label}</span>
    </div>
  );
}

function RibbonStepConnector({ step }: { step: ScaleRibbonData["steps"][number] }) {
  return (
    <div className="mb-3 flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5">
      <div
        className="h-1 w-full min-w-[8px] rounded-full"
        style={{ backgroundColor: step.color.css() }}
      />
      <span className="text-[10px] font-medium leading-none" style={{ color: step.color.css() }}>
        {step.label}
      </span>
    </div>
  );
}

function StepLegendHint() {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-labels-textDefault opacity-70">
      <span>
        <span className="font-medium" style={{ color: "rgb(255, 166, 0)" }}>
          W
        </span>{" "}
        whole
      </span>
      <span>
        <span className="font-medium" style={{ color: "rgb(219, 20, 61)" }}>
          H
        </span>{" "}
        half
      </span>
      <span>
        <span className="font-medium" style={{ color: "rgb(255, 215, 0)" }}>
          A2
        </span>{" "}
        aug 2nd
      </span>
    </div>
  );
}
