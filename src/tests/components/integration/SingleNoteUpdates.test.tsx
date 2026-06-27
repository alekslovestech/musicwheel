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

function verifyNoteName(expectedNoteName: string) {
  const chordNameNoteGrouping = document.getElementById("chord-name-note-grouping");
  const chordNameValue = document.getElementById("chord-name-value");
  expect(chordNameNoteGrouping).toBeInTheDocument();
  expect(chordNameValue).toBeInTheDocument();
  expect(chordNameNoteGrouping).toHaveTextContent("Note:");
  expect(chordNameValue).toHaveTextContent(expectedNoteName);
}

describe("SingleNoteUpdates", () => {
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
    ReactTestUtils.clickKey("mode-singlenote");
  });

  describe("User interacts with the linear keyboard", () => {
    test("Major chord default => click A on linear keyboard => A major", () => {
      ReactTestUtils.clickKey("linearKey09"); //click A
      keyVerificationUtils.verifySelectedLinearKeys([9]); //A
      verifyNoteName("A");
    });
  });

  describe("User interacts with the transpose widget", () => {
    test("Transposing notes up should update the chord name", () => {
      ReactTestUtils.clickKey("transpose-up-button");
      verifyNoteName("G♯");
    });

    test("Transposing notes down should update the chord name", () => {
      ReactTestUtils.clickKey("transpose-down-button");
      verifyNoteName("F♯");
    });
  });
});
