import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { RootProvider } from "@/contexts/RootContext";
import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { InputModeSelector } from "@/components/Settings/InputModeSelector";
import { ChordPresetSelector } from "@/components/Settings/ChordPresetsSelector";
import { ChordNameDisplay } from "@/components/ChordNameDisplay";

import { SettingsPanelDefault } from "@/components/Settings/SettingsPanelDefault";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";

import { ReactTestUtils } from "@/tests/reactutils/ReactTestUtils";
import { keyVerificationUtils } from "@/tests/reactutils/KeyboardVerificationUtils";

function verifyIntervalName(expectedIntervalName: string) {
  const chordNameNoteGrouping = document.getElementById("chord-name-note-grouping");
  const chordNameValue = document.getElementById("chord-name-value");
  expect(chordNameNoteGrouping).toBeInTheDocument();
  expect(chordNameValue).toBeInTheDocument();
  expect(chordNameNoteGrouping).toHaveTextContent("Interval:");
  expect(chordNameValue).toHaveTextContent(expectedIntervalName);
}

describe("IntervalUpdates", () => {
  const renderComponent = () =>
    render(
      <RootProvider>
        <KeyboardLinear />
        <KeyboardCircular />
        <InputModeSelector />
        <ChordPresetSelector />
        <ChordNameDisplay />
        <SettingsPanelDefault />
      </RootProvider>,
    );

  beforeEach(() => {
    renderComponent();
    ReactTestUtils.clickKey("mode-intervals");
  });

  describe("User interacts with the linear keyboard", () => {
    test("Major chord default => click A on linear keyboard => M3 (starting at A)", () => {
      ReactTestUtils.clickKey("linearKey09"); //click A
      keyVerificationUtils.verifySelectedLinearKeys([9, 13]); //A C#
      verifyIntervalName("M3");
    });
  });

  describe("User interacts with the transpose widget", () => {
    test("Transposing notes up should update the chord name", () => {
      ReactTestUtils.clickKey("transpose-up-button");
      verifyIntervalName("M3");
    });

    test("Transposing notes down should update the interval name", () => {
      ReactTestUtils.clickKey("transpose-down-button");
      verifyIntervalName("M3");
    });
  });
});
