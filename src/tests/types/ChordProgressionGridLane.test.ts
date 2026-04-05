import {
  ChordProgressionGridLane,
  type AllBars,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";

const sampleRows: AllBars = [
  [
    { label: "I", colSpan: 4, progressionEntryIndex: 0 },
    { label: "V", colSpan: 4, progressionEntryIndex: 1 },
  ],
];

describe("ChordProgressionGridLane", () => {
  it("holds rows and readHeadStepIndex", () => {
    const lane = new ChordProgressionGridLane(sampleRows, 1);
    expect(lane.rows).toBe(sampleRows);
    expect(lane.readHeadStepIndex).toBe(1);
  });

  it("withReadHead returns a new lane with same rows and updated read head", () => {
    const a = new ChordProgressionGridLane(sampleRows, null);
    const b = a.withReadHead(0);
    expect(b).not.toBe(a);
    expect(b.rows).toBe(sampleRows);
    expect(b.readHeadStepIndex).toBe(0);
    expect(a.readHeadStepIndex).toBe(null);
  });
});
