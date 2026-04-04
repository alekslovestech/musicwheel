import { render } from "@testing-library/react";

import { ChordProgressionDisplay } from "@/components/ChordProgressionDisplay";
import type { BarRow } from "@/types/ChordProgressions/ChordProgressionFormattingTypes";

const sampleBars: BarRow[] = [
  [
    { label: "I", colSpan: 4, progressionEntryIndex: 0 },
    { label: "V", colSpan: 4, progressionEntryIndex: 1 },
    { label: "vi", colSpan: 4, progressionEntryIndex: 2 },
    { label: "IV", colSpan: 4, progressionEntryIndex: 3 },
  ],
];

describe("ChordProgressionDisplay", () => {
  it("does not mark cells active when activeProgressionStepIndex is null", () => {
    const { container } = render(
      <ChordProgressionDisplay
        bars={sampleBars}
        activeProgressionStepIndex={null}
      />,
    );
    expect(
      container.querySelectorAll('[data-active="true"]'),
    ).toHaveLength(0);
  });

  it("marks the token whose progressionEntryIndex matches the active step", () => {
    const { container } = render(
      <ChordProgressionDisplay bars={sampleBars} activeProgressionStepIndex={2} />,
    );
    const active = container.querySelectorAll('[data-active="true"]');
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveTextContent("vi");
  });
});
