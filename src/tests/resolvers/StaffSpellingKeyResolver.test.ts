import { KeyType } from "@/types/enums/KeyType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { StaffSpellingKeyResolver } from "@/utils/resolvers/StaffSpellingKeyResolver";

describe("StaffSpellingKeyResolver", () => {
  test("C double harmonic major prefers A minor", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.DoubleHarmonicMajor);
    const staffKey = StaffSpellingKeyResolver.resolveBestFit(key);
    expect(staffKey.tonicString).toBe("A");
    expect(staffKey.classicalMode).toBe(KeyType.Minor);
  });

  test("C Ukrainian Dorian prefers Bb major", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.UkrainianDorian);
    const staffKey = StaffSpellingKeyResolver.resolveBestFit(key);
    expect(staffKey.tonicString).toBe("Bb");
    expect(staffKey.classicalMode).toBe(KeyType.Major);
  });

  test("C Hungarian minor prefers E minor", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor);
    const staffKey = StaffSpellingKeyResolver.resolveBestFit(key);
    expect(staffKey.tonicString).toBe("E");
    expect(staffKey.classicalMode).toBe(KeyType.Minor);
  });

  test("C harmonic minor prefers C minor", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.HarmonicMinor);
    const staffKey = StaffSpellingKeyResolver.resolveBestFit(key);
    expect(staffKey.tonicString).toBe("C");
    expect(staffKey.classicalMode).toBe(KeyType.Minor);
  });
});
