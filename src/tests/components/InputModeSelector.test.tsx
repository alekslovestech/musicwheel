import { fireEvent, render } from "@testing-library/react";

import { ReactTestUtils } from "../reactutils/ReactTestUtils";

import { RootProvider } from "@/contexts/RootContext";

import { InputModeSelector } from "@/components/Settings/InputModeSelector";
import { ChordPresetSelector } from "@/components/Settings/ChordPresetsSelector";

describe("ModeSelector with preset buttons", () => {
  const renderComponent = () =>
    render(
      <RootProvider>
        <InputModeSelector />
        <ChordPresetSelector />
      </RootProvider>,
    );

  describe("Default Behavior", () => {
    beforeEach(() => {
      renderComponent();
    });

    test("initializes with ChordMode mode active", () => {
      const chordModeButton = document.getElementById("mode-chords");
      expect(chordModeButton).toBeInTheDocument();
      expect(chordModeButton).toHaveClass("selected");
      expect(chordModeButton).toHaveTextContent("Chords");
    });
  });

  describe("Mode Switching", () => {
    beforeEach(() => {
      renderComponent();
    });

    test("switches from Single Note to Freeform mode correctly", () => {
      ReactTestUtils.expectElementByIdToBeSelected("mode-chords");
      ReactTestUtils.expectElementByIdToBeUnselected("mode-freeform");

      ReactTestUtils.clickKey("mode-freeform");

      ReactTestUtils.expectElementByIdToBeSelected("mode-freeform");
      ReactTestUtils.expectElementByIdToBeUnselected("mode-singlenote");
    });
  });

  describe("Mode-specific Preset Buttons", () => {
    describe("Interval Mode", () => {
      beforeEach(() => {
        renderComponent();
        fireEvent.click(document.getElementById("mode-intervals")!);
      });
      test("selects M3 interval as default", () => {
        ReactTestUtils.expectElementByIdToBeSelected("preset-Interval_Maj3");
      });
    });

    describe("Chord Mode", () => {
      beforeEach(() => {
        renderComponent();
        fireEvent.click(document.getElementById("mode-chords")!);
      });

      test("displays correct preset buttons", () => {
        ReactTestUtils.expectElementByIdToBeInTheDocument("preset-Chord_Sus2");
        ReactTestUtils.expectElementByIdNotToBeInTheDocument("preset-Interval_Tritone");
        ReactTestUtils.expectElementByIdToBeInTheDocument("inversion-0");
      });

      test("selects Maj chord as default", () => {
        ReactTestUtils.expectElementByIdToBeSelected("preset-Chord_Maj");
      });
    });
  });
});
