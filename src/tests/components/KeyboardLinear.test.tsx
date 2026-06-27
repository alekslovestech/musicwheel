import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { RootProvider } from "@/contexts/RootContext";

import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { HarmonyInputModeSelector } from "@/components/Settings/HarmonyInputModeSelector";
import { ChordPresetSelector } from "@/components/Settings/ChordPresetsSelector";

import { ReactTestUtils } from "@/tests/reactutils/ReactTestUtils";
import { keyVerificationUtils } from "@/tests/reactutils/KeyboardVerificationUtils";

//scenarios where we only test the linear keyboard
describe("KeyboardLinear", () => {
  const renderComponent = () =>
    render(
      <RootProvider>
        <KeyboardLinear />
        <HarmonyInputModeSelector />
        <ChordPresetSelector />
      </RootProvider>,
    );

  beforeEach(() => {
    renderComponent();
    ReactTestUtils.clickKey("mode-singlenote");
  });

  test("initial setup (G selected)", () => {
    const pianoKeys = document.querySelectorAll("[id^='linearKey']");
    expect(pianoKeys.length).toBe(24);

    const fSharpNote = document.getElementById("linearKey06");
    const gNote = document.getElementById("linearKey07");

    expect(fSharpNote).toBeInTheDocument();
    expect(fSharpNote).toHaveClass("short");

    expect(gNote).toBeInTheDocument();
    expect(gNote).toHaveTextContent("G");

    fireEvent.click(gNote!);
    keyVerificationUtils.verifySelectedLinearKeys([7]);
  });

  test("removing last note leaves no notes selected", () => {
    const freeFormButton = document.getElementById("mode-freeform");
    fireEvent.click(freeFormButton!);
    expect(freeFormButton).toHaveClass("selected");

    ReactTestUtils.clickKey("linearKey07");

    keyVerificationUtils.verifySelectedLinearKeys([]); //verify there are no notes left
  });

  test("add9 chord at A configured correctly", () => {
    ReactTestUtils.clickKey("mode-chords");

    // Find and click the add9 chord preset button
    ReactTestUtils.clickKey("preset-Chord_Add9");
    ReactTestUtils.clickKey("linearKey09");
    keyVerificationUtils.verifySelectedLinearKeys([9, 13, 16, 23]); //A C# E B
  });

  test("add9 chord at A# truncates correctly", () => {
    ReactTestUtils.clickKey("mode-chords");

    ReactTestUtils.clickKey("preset-Chord_Add9");
    ReactTestUtils.clickKey("linearKey10");
    keyVerificationUtils.verifySelectedLinearKeys([10, 14, 17]); //A# D F (truncated)
  });

  test.skip("When inversion 1 is selected, clicking around on the keyboard should only produce inversion 1", () => {
    ReactTestUtils.clickKey("mode-chords");
    ReactTestUtils.clickKey("preset-Chord_Maj");
    ReactTestUtils.clickKey("linearKey00");
    keyVerificationUtils.verifySelectedLinearKeys([0, 4, 7]);

    // Select inversion 1
    ReactTestUtils.clickKey("inversion-1");

    keyVerificationUtils.verifySelectedLinearKeys([4, 7, 12]);
    // Verify that the 12th key (C in the second octave) is a root note
    const secondOctaveC = document.getElementById("linearKey12");
    expect(secondOctaveC).toHaveClass("root-note");

    const secondOctaveD = document.getElementById("linearKey14");
    // Click on different keys and expect inversion 1 to be maintained n
    fireEvent.click(secondOctaveD!); // Clicking on D in the 2nd octave
    keyVerificationUtils.verifySelectedLinearKeys([6, 9, 14]);

    expect(secondOctaveD).toHaveClass("root-note");
  });
});
