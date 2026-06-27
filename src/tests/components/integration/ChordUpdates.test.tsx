import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { RootProvider } from "@/contexts/RootContext";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { HarmonyInputModeSelector } from "@/components/Settings/HarmonyInputModeSelector";
import { ChordPresetSelector } from "@/components/Settings/ChordPresetsSelector";
import { ChordNameDisplay } from "@/components/ChordNameDisplay";
import { SettingsPanelDefault } from "@/components/Settings/SettingsPanelDefault";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";

import { ReactTestUtils } from "@/tests/reactutils/ReactTestUtils";
import { keyVerificationUtils } from "@/tests/reactutils/KeyboardVerificationUtils";

function verifyChordName(expectedChordName: string) {
  const chordNameNoteGrouping = document.getElementById("chord-name-note-grouping");
  const chordNameValue = document.getElementById("chord-name-value");
  expect(chordNameNoteGrouping).toBeInTheDocument();
  expect(chordNameValue).toBeInTheDocument();
  expect(chordNameNoteGrouping).toHaveTextContent("Chord:");
  expect(chordNameValue).toHaveTextContent(expectedChordName);
}

describe("ChordUpdates", () => {
  const renderComponent = () =>
    render(
      <RootProvider>
        <KeyboardLinear />
        <KeyboardCircular />
        <HarmonyInputModeSelector />
        <ChordPresetSelector />
        <ChordNameDisplay />
        <SettingsPanelDefault />
      </RootProvider>,
    );

  beforeEach(() => {
    renderComponent();
    ReactTestUtils.clickKey("mode-chords");
  });

  describe("User interacts with the linear keyboard", () => {
    test("Major chord default => click A on linear keyboard => A major", () => {
      ReactTestUtils.clickKey("linearKey09"); //click A
      keyVerificationUtils.verifySelectedLinearKeys([9, 13, 16]); //A C# E
      verifyChordName("A"); //A major
    });
  });

  describe("User interacts with the transpose widget", () => {
    test("Transposing notes up should update the chord name", () => {
      ReactTestUtils.clickKey("transpose-up-button");
      verifyChordName("A♭"); //A♭ major
    });

    test("Transposing notes down should update the chord name", () => {
      ReactTestUtils.clickKey("transpose-down-button");
      verifyChordName("F♯"); //F# major
    });

    test("Inversion 1 of G => G/B", () => {
      ReactTestUtils.clickKey("inversion-1");
      verifyChordName("G/B");
    });

    test("Inversion 2 of G => G/D", () => {
      ReactTestUtils.clickKey("inversion-2");
      verifyChordName("G/D");
    });

    test("Inversion 1 of G, then transpose up => A♭/C", () => {
      ReactTestUtils.clickKey("inversion-1");
      ReactTestUtils.clickKey("transpose-up-button");
      verifyChordName("A♭/C");
    });

    test("Inversion 1 of G, then transpose down => F#/A#", () => {
      ReactTestUtils.clickKey("inversion-1");
      ReactTestUtils.clickKey("transpose-down-button");
      verifyChordName("F♯/A♯");
    });

    test("Inversion 1 of G, then click A", () => {
      ReactTestUtils.clickKey("inversion-1"); //G/B
      ReactTestUtils.clickKey("linearKey09"); //click A
      verifyChordName("F/A");
    });

    test("Pressing inversion buttons should update the displayed notes", () => {
      // Start with G major in root position [7, 11, 14] = G, B, D
      keyVerificationUtils.verifySelectedLinearKeys([7, 11, 14]);
      verifyChordName("G");

      // Click inversion 1 button - should show [11, 14, 19] = B, D, G
      ReactTestUtils.clickKey("inversion-1");
      keyVerificationUtils.verifySelectedLinearKeys([11, 14, 19]);
      verifyChordName("G/B");
    });

    test("Transposing from B (index 11) to C should go to C in next octave (index 12)", () => {
      // Start by clicking B note (index 11) to set up B major
      ReactTestUtils.clickKey("linearKey11"); // B
      keyVerificationUtils.verifySelectedLinearKeys([11, 15, 18]); // B, D#, F#
      verifyChordName("B");

      // Transpose up - should go to C major in next octave [12, 16, 19], not [0, 4, 7]
      ReactTestUtils.clickKey("transpose-up-button");
      keyVerificationUtils.verifySelectedLinearKeys([12, 16, 19]); // C, E, G in second octave
      verifyChordName("C");
    });
  });
});
