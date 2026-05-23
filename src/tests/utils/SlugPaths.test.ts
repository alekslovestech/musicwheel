import { GlobalMode } from "@/types/enums/GlobalMode";
import { getBasePath, getPath } from "@/utils/slug/paths";

describe("paths", () => {
  describe("getBasePath", () => {
    it("returns the base path for each GlobalMode", () => {
      expect(getBasePath(GlobalMode.Harmony)).toBe("/harmony");
      expect(getBasePath(GlobalMode.Scales)).toBe("/scales");
      expect(getBasePath(GlobalMode.ChordProgressions)).toBe("/progressions");
    });
  });

  describe("getPath", () => {
    it("builds slug-less harmony paths", () => {
      expect(getPath(GlobalMode.Harmony)).toBe("/harmony");
      expect(getPath(GlobalMode.Harmony, undefined, true)).toBe("/harmony?isDemo");
    });

    it("builds slugged paths for scales and progressions", () => {
      expect(getPath(GlobalMode.Scales, "ionian")).toBe("/scales/ionian");
      expect(getPath(GlobalMode.ChordProgressions, "gypsy-woman", true)).toBe(
        "/progressions/gypsy-woman?isDemo",
      );
    });
  });
});
