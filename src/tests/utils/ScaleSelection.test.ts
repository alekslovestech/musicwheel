import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import {
  isLegalTonic,
  legalTonicsForScaleMode,
  playbackModeToSlug,
  routeMatchesScaleSelection,
  scaleSelectionFromRoute,
  scaleSelectionPath,
  slugToPlaybackMode,
  slugToTonic,
  tonicToSlug,
  type ScaleSelection,
} from "@/utils/slug/scaleSelection";

function fakeSearchParams(params: Record<string, string>): { get(name: string): string | null } {
  return { get: (name) => params[name] ?? null };
}

describe("scaleSelection", () => {
  describe("tonicToSlug / slugToTonic", () => {
    it("round-trips naturals, sharps, and flats", () => {
      expect(tonicToSlug("C")).toBe("c");
      expect(tonicToSlug("F#")).toBe("f-sharp");
      expect(tonicToSlug("Bb")).toBe("b-flat");
      expect(slugToTonic("c")).toBe("C");
      expect(slugToTonic("f-sharp")).toBe("F#");
      expect(slugToTonic("b-flat")).toBe("Bb");
    });

    it("normalizes display accidental symbols before slugging", () => {
      expect(tonicToSlug("F♯")).toBe("f-sharp");
      expect(tonicToSlug("B♭")).toBe("b-flat");
    });

    it("is case-insensitive when decoding", () => {
      expect(slugToTonic("F-SHARP")).toBe("F#");
      expect(slugToTonic("B-Flat")).toBe("Bb");
    });

    it("rejects malformed slugs", () => {
      expect(slugToTonic("")).toBeUndefined();
      expect(slugToTonic("h")).toBeUndefined();
      expect(slugToTonic("fx")).toBeUndefined();
      expect(slugToTonic("f-sharp-sharp")).toBeUndefined();
      expect(slugToTonic("fs")).toBeUndefined();
    });
  });

  describe("legalTonicsForScaleMode / isLegalTonic", () => {
    it("uses the major key list for the major-family modes", () => {
      expect(legalTonicsForScaleMode(ScaleModeType.Ionian)).toContain("Db");
      expect(legalTonicsForScaleMode(ScaleModeType.Lydian)).toContain("Db");
      expect(legalTonicsForScaleMode(ScaleModeType.Ionian)).not.toContain("C#");
    });

    it("uses the minor key list for every other mode", () => {
      expect(legalTonicsForScaleMode(ScaleModeType.Dorian)).toContain("C#");
      expect(legalTonicsForScaleMode(ScaleModeType.Dorian)).not.toContain("Db");
      expect(legalTonicsForScaleMode(ScaleModeType.HarmonicMinor)).toContain("G#");
    });

    it("agrees with legalTonicsForScaleMode", () => {
      expect(isLegalTonic("Db", ScaleModeType.Ionian)).toBe(true);
      expect(isLegalTonic("C#", ScaleModeType.Ionian)).toBe(false);
      expect(isLegalTonic("C#", ScaleModeType.Dorian)).toBe(true);
    });
  });

  describe("playbackModeToSlug / slugToPlaybackMode", () => {
    it("round-trips every scale playback mode", () => {
      for (const mode of Object.values(ScalePlaybackMode)) {
        const slug = playbackModeToSlug(mode);
        expect(slugToPlaybackMode(slug)).toBe(mode);
      }
    });

    it("rejects unknown slugs", () => {
      expect(slugToPlaybackMode("nonsense")).toBeUndefined();
    });
  });

  describe("scaleSelectionPath", () => {
    it("builds a fully-specified canonical URL with tonic and mode as path segments", () => {
      const selection: ScaleSelection = {
        tonic: "F#",
        scaleMode: ScaleModeType.Dorian,
        playbackMode: ScalePlaybackMode.DronedSingleNote,
      };
      expect(scaleSelectionPath(selection)).toBe("/scales/f-sharp/dorian?play=droned");
    });

    it("appends the demo flag when requested", () => {
      const selection: ScaleSelection = {
        tonic: "C",
        scaleMode: ScaleModeType.Ionian,
        playbackMode: ScalePlaybackMode.SingleNote,
      };
      expect(scaleSelectionPath(selection, { demo: true })).toBe(
        "/scales/c/ionian?play=single&isDemo",
      );
    });
  });

  describe("scaleSelectionFromRoute", () => {
    const fallback: ScaleSelection = {
      tonic: "C",
      scaleMode: ScaleModeType.Ionian,
      playbackMode: ScalePlaybackMode.SingleNote,
    };

    it("parses a fully-specified route", () => {
      const searchParams = fakeSearchParams({ play: "triad" });
      expect(scaleSelectionFromRoute("b-flat", "dorian", searchParams, fallback)).toEqual({
        tonic: "Bb",
        scaleMode: ScaleModeType.Dorian,
        playbackMode: ScalePlaybackMode.Triad,
      });
    });

    it("falls back to the given selection for missing params", () => {
      const searchParams = fakeSearchParams({});
      expect(scaleSelectionFromRoute("b-flat", "dorian", searchParams, fallback)).toEqual({
        tonic: "Bb",
        scaleMode: ScaleModeType.Dorian,
        playbackMode: fallback.playbackMode,
      });
    });

    it("falls back for an unparseable tonic or playback slug instead of throwing", () => {
      const searchParams = fakeSearchParams({ play: "bogus" });
      expect(scaleSelectionFromRoute("xx", "dorian", searchParams, fallback)).toEqual({
        tonic: fallback.tonic,
        scaleMode: ScaleModeType.Dorian,
        playbackMode: fallback.playbackMode,
      });
    });

    it("falls back when the tonic doesn't legally belong to the resolved mode", () => {
      // Db is a valid tonic spelling, but only for major-family modes - not Dorian.
      const searchParams = fakeSearchParams({});
      expect(scaleSelectionFromRoute("d-flat", "dorian", searchParams, fallback)).toEqual({
        tonic: fallback.tonic,
        scaleMode: ScaleModeType.Dorian,
        playbackMode: fallback.playbackMode,
      });
    });

    it("tolerates missing search params entirely", () => {
      expect(scaleSelectionFromRoute("b-flat", "dorian", null, fallback)).toEqual({
        tonic: "Bb",
        scaleMode: ScaleModeType.Dorian,
        playbackMode: fallback.playbackMode,
      });
    });
  });

  describe("routeMatchesScaleSelection", () => {
    const selection: ScaleSelection = {
      tonic: "F#",
      scaleMode: ScaleModeType.Dorian,
      playbackMode: ScalePlaybackMode.Seventh,
    };

    it("is true when path segments and params match the selection exactly", () => {
      const searchParams = fakeSearchParams({ play: "seventh" });
      expect(routeMatchesScaleSelection("f-sharp", "dorian", searchParams, selection)).toBe(true);
    });

    it("is false when any axis differs", () => {
      expect(
        routeMatchesScaleSelection("f-sharp", "ionian", fakeSearchParams({ play: "seventh" }), selection),
      ).toBe(false);
      expect(
        routeMatchesScaleSelection("c", "dorian", fakeSearchParams({ play: "seventh" }), selection),
      ).toBe(false);
      expect(
        routeMatchesScaleSelection("f-sharp", "dorian", fakeSearchParams({ play: "triad" }), selection),
      ).toBe(false);
    });

    it("is false when params are missing", () => {
      expect(routeMatchesScaleSelection("f-sharp", "dorian", fakeSearchParams({}), selection)).toBe(
        false,
      );
      expect(routeMatchesScaleSelection("f-sharp", "dorian", null, selection)).toBe(false);
    });
  });
});
