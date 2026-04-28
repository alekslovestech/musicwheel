import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { keyVerificationUtils } from "../reactutils/KeyboardVerificationUtils";
import { ReactTestUtils } from "../reactutils/ReactTestUtils";

import { RootProvider } from "@/contexts/RootContext";

import { KeyboardLinear } from "@/components/Keyboard/Linear/KeyboardLinear";
import { InputModeSelector } from "@/components/Settings/InputModeSelector";
import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { ChordPresetSelector } from "@/components/Settings/ChordPresetsSelector";

//scenarios where setup is the same for both linear and circular keyboards
describe("KeyboardGeneral", () => {
  const renderComponent = () =>
    render(
      <RootProvider>
        <KeyboardLinear />
        <KeyboardCircular />
        <InputModeSelector />
        <ChordPresetSelector />
      </RootProvider>,
    );

  beforeEach(() => {
    renderComponent();
    ReactTestUtils.clickKey("mode-singlenote");
  });

  test("test initial setup (G selected)", () => {
    keyVerificationUtils.verifySelectedCircularKeys([7]);
    keyVerificationUtils.verifySelectedLinearKeys([7]);
  });

  test("switching mode to Freeform renders 1 note (still)", () => {
    ReactTestUtils.clickKey("mode-freeform");
    keyVerificationUtils.verifySelectedLinearKeys([7]);
    keyVerificationUtils.verifySelectedCircularKeys([7]);
  });

  test("switching mode to Interval Presets renders 2 notes", () => {
    ReactTestUtils.clickKey("mode-intervals");
    keyVerificationUtils.verifySelectedLinearKeys([7, 11]);
    keyVerificationUtils.verifySelectedCircularKeys([7, 11]);
  });

  test("switching mode to Interval Presets and then Freeform renders 2 notes (still)", () => {
    ReactTestUtils.clickKey("mode-intervals");
    ReactTestUtils.clickKey("mode-freeform");

    keyVerificationUtils.verifySelectedLinearKeys([7, 11]);
    keyVerificationUtils.verifySelectedCircularKeys([7, 11]);
  });

  test("switching mode to Chord Presets renders 3 notes", () => {
    ReactTestUtils.clickKey("mode-chords");
    keyVerificationUtils.verifySelectedLinearKeys([7, 11, 14]);
    keyVerificationUtils.verifySelectedCircularKeys([7, 11, 2]);
  });

  test("switching mode to Chord Presets and then Freeform renders 3 notes (still)", () => {
    ReactTestUtils.clickKey("mode-chords");
    ReactTestUtils.clickKey("mode-freeform");

    keyVerificationUtils.verifySelectedLinearKeys([7, 11, 14]);
    keyVerificationUtils.verifySelectedCircularKeys([7, 11, 2]);
  });

  test("switching Single Note mode from a non-zero inversion doens't crash", () => {
    ReactTestUtils.clickKey("mode-chords");
    ReactTestUtils.clickKey("inversion-1");
    ReactTestUtils.clickKey("mode-singlenote");
  });

  test("Removing last key in freeform mode", () => {
    ReactTestUtils.clickKey("mode-freeform");
    ReactTestUtils.clickKey("linearKey07");

    keyVerificationUtils.verifySelectedLinearKeys([]); //verify there are no notes left
    keyVerificationUtils.verifySelectedCircularKeys([]); //verify there are no notes left
  });
});

describe("Keyboards in Advanced Mode", () => {
  const renderComponent = () =>
    render(
      <RootProvider>
        <KeyboardLinear />
        <KeyboardCircular />
        <InputModeSelector />
        <ChordPresetSelector />
      </RootProvider>,
    );

  beforeEach(() => {
    renderComponent();
  });

  test.skip("No keys selected in Advanced mode", () => {
    keyVerificationUtils.verifySelectedLinearKeys([]);
    keyVerificationUtils.verifySelectedCircularKeys([]);
  });

  test.skip("Advanced mode means keys are disabled", () => {
    keyVerificationUtils.verifyLinearKeysDisabled();
    keyVerificationUtils.verifyCircularKeysDisabled();
  });
});
