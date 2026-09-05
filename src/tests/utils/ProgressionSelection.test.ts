import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import {
  defaultProgressionSelection,
  isLegalProgressionTonic,
  legalTonicsForProgression,
  progressionSelectionFromRoute,
  progressionSelectionPath,
  routeMatchesProgressionSelection,
  suggestedKeyForProgression,
  DEFAULT_PROGRESSION_TYPE,
  type ProgressionSelection,
} from "@/utils/slug/progressionSelection";

describe("progressionSelection", () => {
  describe("suggestedKeyForProgression", () => {
    it("uses the registry's suggested key when set", () => {
      expect(suggestedKeyForProgression(ChordProgressionType.Andalusian_Cadence).tonicString).toBe("A");
      expect(suggestedKeyForProgression(ChordProgressionType.Gypsy_Woman).tonicString).toBe("F");
    });

    it("falls back to the default musical key when unset", () => {
      const key = suggestedKeyForProgression(ChordProgressionType.Plagal_Cadence);
      expect(key.tonicString).toBe("C");
    });
  });

  describe("legalTonicsForProgression / isLegalProgressionTonic", () => {
    it("uses the minor key list for a minor-key progression", () => {
      const tonics = legalTonicsForProgression(ChordProgressionType.Andalusian_Cadence);
      expect(tonics).toContain("C#");
      expect(tonics).not.toContain("Db");
    });

    it("uses the major key list for a major-key progression", () => {
      const tonics = legalTonicsForProgression(ChordProgressionType.Gypsy_Woman);
      expect(tonics).toContain("Db");
      expect(tonics).not.toContain("C#");
    });

    it("agrees with legalTonicsForProgression", () => {
      expect(isLegalProgressionTonic("C#", ChordProgressionType.Andalusian_Cadence)).toBe(true);
      expect(isLegalProgressionTonic("Db", ChordProgressionType.Andalusian_Cadence)).toBe(false);
    });
  });

  describe("progressionSelectionPath", () => {
    it("builds a fully-specified canonical URL", () => {
      const selection: ProgressionSelection = {
        tonic: "F#",
        progression: ChordProgressionType.Andalusian_Cadence,
      };
      expect(progressionSelectionPath(selection)).toBe("/progressions/f-sharp/andalusian-cadence");
    });

    it("appends the demo flag when requested", () => {
      const selection: ProgressionSelection = {
        tonic: "C",
        progression: ChordProgressionType.Plagal_Cadence,
      };
      expect(progressionSelectionPath(selection, { demo: true })).toBe(
        "/progressions/c/plagal-cadence?isDemo",
      );
    });
  });

  describe("progressionSelectionFromRoute", () => {
    it("parses a fully-specified route", () => {
      expect(
        progressionSelectionFromRoute("f-sharp", "andalusian-cadence", ChordProgressionType.Plagal_Cadence),
      ).toEqual({
        tonic: "F#",
        progression: ChordProgressionType.Andalusian_Cadence,
      });
    });

    it("falls back to the resolved progression's own suggested tonic when the tonic is missing or unparseable", () => {
      expect(
        progressionSelectionFromRoute("xx", "gypsy-woman", ChordProgressionType.Plagal_Cadence),
      ).toEqual({
        tonic: "F",
        progression: ChordProgressionType.Gypsy_Woman,
      });
    });

    it("falls back to the resolved progression's own suggested tonic when the tonic isn't legal for it", () => {
      // Db is a valid tonic spelling, but only for major keys - Andalusian Cadence is in A minor.
      expect(
        progressionSelectionFromRoute("d-flat", "andalusian-cadence", ChordProgressionType.Plagal_Cadence),
      ).toEqual({
        tonic: "A",
        progression: ChordProgressionType.Andalusian_Cadence,
      });
    });

    it("falls back to the given progression for an unparseable progression slug", () => {
      expect(progressionSelectionFromRoute("c", "not-a-real-progression", ChordProgressionType.Gypsy_Woman)).toEqual(
        {
          tonic: "C",
          progression: ChordProgressionType.Gypsy_Woman,
        },
      );
    });
  });

  describe("routeMatchesProgressionSelection", () => {
    const selection: ProgressionSelection = {
      tonic: "F#",
      progression: ChordProgressionType.Andalusian_Cadence,
    };

    it("is true when path segments match the selection exactly", () => {
      expect(routeMatchesProgressionSelection("f-sharp", "andalusian-cadence", selection)).toBe(true);
    });

    it("is false when either axis differs", () => {
      expect(routeMatchesProgressionSelection("c", "andalusian-cadence", selection)).toBe(false);
      expect(routeMatchesProgressionSelection("f-sharp", "gypsy-woman", selection)).toBe(false);
    });
  });

  describe("defaultProgressionSelection", () => {
    it("uses the default progression's own suggested tonic", () => {
      expect(defaultProgressionSelection()).toEqual({
        tonic: suggestedKeyForProgression(DEFAULT_PROGRESSION_TYPE).tonicString,
        progression: DEFAULT_PROGRESSION_TYPE,
      });
    });
  });
});
