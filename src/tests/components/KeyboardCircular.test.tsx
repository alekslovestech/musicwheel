import { render } from "@testing-library/react";

import { RootProvider } from "@/contexts/RootContext";

import { KeyboardCircular } from "@/components/Keyboard/Circular/KeyboardCircular";
import { HarmonyInputModeSelector } from "@/components/Settings/HarmonyInputModeSelector";
import { ChordPresetSelector } from "@/components/Settings/ChordPresetsSelector";

import { ReactTestUtils } from "@/tests/reactutils/ReactTestUtils";
import { keyVerificationUtils } from "@/tests/reactutils/KeyboardVerificationUtils";

//scenarios where we only test the circular keyboard
describe("KeyboardCircular", () => {
  const renderComponent = () =>
    render(
      <RootProvider>
        <KeyboardCircular />
        <HarmonyInputModeSelector />
        <ChordPresetSelector />
      </RootProvider>,
    );

  beforeEach(() => {
    renderComponent();
    ReactTestUtils.clickKey("mode-singlenote");
  });

  test("handles click on the 'C' slice", () => {
    ReactTestUtils.clickKey("circularKey00");
    keyVerificationUtils.verifySelectedCircularKeys([0]);
  });

  test("handles click on the 'A' slice", () => {
    ReactTestUtils.clickKey("circularKey09");
    keyVerificationUtils.verifySelectedCircularKeys([9]);
  });
});
