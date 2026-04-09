import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";

describe("VexFlowFormatter.noteLengthToVexDuration", () => {
  it("maps LilyPond-style denominators to VexFlow duration strings", () => {
    expect(VexFlowFormatter.noteLengthToVexDuration(1)).toBe("w");
    expect(VexFlowFormatter.noteLengthToVexDuration(2)).toBe("h");
    expect(VexFlowFormatter.noteLengthToVexDuration(4)).toBe("q");
    expect(VexFlowFormatter.noteLengthToVexDuration(8)).toBe("8");
    expect(VexFlowFormatter.noteLengthToVexDuration(16)).toBe("16");
    expect(VexFlowFormatter.noteLengthToVexDuration(32)).toBe("32");
  });
});
