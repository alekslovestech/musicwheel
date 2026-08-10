import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import {
  buildScaleRibbonData,
  getIntervalTypesForScaleFromRoot,
  getStepColorLegendItems,
  LabelWithColor,
  showsStepSegments,
} from "@/utils/visual/scaleRibbonUtils";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

// "labels" ribbons carry bare label strings (with or without step annotations); "swatches"
// ribbons carry {label, color}.
const noteLabel = (note: string | LabelWithColor): string =>
  typeof note === "string" ? note : note.label;

describe("buildScaleRibbonData", () => {
  const constants = GreekTestConstants.getInstance();
  const cIonian = constants.C_IONIAN_KEY;

  const labelsFor = (key: typeof cIonian, mode: ScalePlaybackMode): string[] =>
    buildScaleRibbonData(key, mode).notes.map(noteLabel);

  describe("Seventh mode", () => {
    // Numeral-only formatting (dropping chord quality) is exercised at the formatter level in
    // RomanDisplay.test.ts / RomanChordFormatter.test.ts; here we only need the ribbon's own
    // shape guarantees, not the spelling of any particular numeral.
    test("is a swatch ribbon - no step segments at all", () => {
      const ribbon = buildScaleRibbonData(cIonian, ScalePlaybackMode.Seventh);
      // "swatches" ribbons carry no `steps` field - there is nothing to have length 0.
      expect(ribbon.kind).toBe("swatches");
      expect(showsStepSegments(ScalePlaybackMode.Seventh, true)).toBe(false);
    });

    test("every degree carries a color", () => {
      const ribbon = buildScaleRibbonData(cIonian, ScalePlaybackMode.Seventh);
      // The "swatches" type guarantees every note has a color; this pins the builder to that
      // variant rather than "labels", where color is optional and lives on steps instead.
      if (ribbon.kind !== "swatches") throw new Error("expected a swatches ribbon");
      expect(ribbon.notes.every((note) => note.color !== undefined)).toBe(true);
    });
  });

  describe("getStepColorLegendItems", () => {
    test("dedupes steps by distance, not by degree", () => {
      // Hungarian Minor's 7 degrees produce only 3 distinct step sizes (H, W, 1½) - one legend
      // entry per size, not one per degree.
      const hungarianMinor = MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor);
      expect(getStepColorLegendItems(hungarianMinor).length).toBe(3);
    });
  });

  describe("getIntervalTypesForScaleFromRoot", () => {
    // Regression: these were folded to interval class first, which replaced every interval
    // above the tritone with its inversion, collapsing distinct intervals onto the same class -
    // the drone legend advertised fewer colors than the scale actually contains.
    test("keeps intervals above the tritone distinct from their inversions", () => {
      const hungarianMinor = MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor);
      // Hungarian Minor is [0, 2, 3, 6, 7, 8, 11] semitones from the root: 6 non-root degrees,
      // no two of which should collapse onto the same interval class.
      expect(getIntervalTypesForScaleFromRoot(hungarianMinor).size).toBe(6);
    });

    test("names every non-root degree of the major scale", () => {
      expect(getIntervalTypesForScaleFromRoot(cIonian).size).toBe(6);
    });
  });

  describe("Notes ribbon", () => {
    test("carries no color - a single note has no interval to derive one from", () => {
      // A colored swatch here would paint the same neutral default on every note (no interval,
      // no color signal), which is noise rather than information. "labels" ribbons structurally
      // cannot carry a color nobody reads.
      const ribbon = buildScaleRibbonData(cIonian, ScalePlaybackMode.SingleNote);
      expect(ribbon.kind).toBe("labels");
    });

    test("keeps the same labels and title when the W-H annotation is switched on", () => {
      // The toggle overlays step connectors; it does not relabel the ribbon.
      const plain = buildScaleRibbonData(cIonian, ScalePlaybackMode.SingleNote);
      const annotated = buildScaleRibbonData(cIonian, ScalePlaybackMode.SingleNote, true);
      expect(annotated.notes.map(noteLabel)).toEqual(plain.notes.map(noteLabel));
      expect(annotated.title).toBe(plain.title);
    });

    test("populates steps only when the W-H annotation is on", () => {
      const plain = buildScaleRibbonData(cIonian, ScalePlaybackMode.SingleNote);
      const annotated = buildScaleRibbonData(cIonian, ScalePlaybackMode.SingleNote, true);
      if (plain.kind !== "labels" || annotated.kind !== "labels") {
        throw new Error("expected labels ribbons");
      }
      expect(plain.steps).toBeUndefined();
      expect(annotated.steps).toHaveLength(plain.notes.length - 1);
    });
  });

  describe("one ribbon vocabulary across the non-chordal lenses", () => {
    // Switching lens must change what you hear, not what things are called - otherwise a
    // listener cannot tell which of the two changes produced the effect. The lens is the
    // variable; the labelling is the control.
    test.each([
      ["C Ionian", constants.C_IONIAN_KEY],
      ["C Phrygian", constants.C_PHRYGIAN_KEY],
      ["C Lydian", constants.C_LYDIAN_KEY],
    ])("Notes and Drone label %s identically", (_name, key) => {
      expect(labelsFor(key, ScalePlaybackMode.DronedSingleNote)).toEqual(
        labelsFor(key, ScalePlaybackMode.SingleNote),
      );
    });
  });
});
