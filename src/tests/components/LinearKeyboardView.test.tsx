import { render } from "@testing-library/react";

import { LinearKeyboardView } from "@/components/Keyboard/Linear/LinearKeyboardView";
import { ixActual, toNoteIndices } from "@/types/IndexTypes";
import { DEFAULT_MUSICAL_KEY } from "@/types/Keys/MusicalKey";

import { keyVerificationUtils } from "@/tests/reactutils/KeyboardVerificationUtils";
import { ReactTestUtils } from "@/tests/reactutils/ReactTestUtils";

// The presentational core Learn figures render directly, with no RootProvider - these guard the
// configurations that make that safe (no context reads) and the ones the Learn figures actually
// use (read-only, and Harmony-mode shading). KeyboardLinear.test.tsx / KeyboardGeneral.test.tsx
// cover the live app's click-to-selection wiring, which lives in the adapter, not here.
describe("LinearKeyboardView", () => {
  test("renders with no provider - reads no context", () => {
    expect(() =>
      render(<LinearKeyboardView musicalKey={DEFAULT_MUSICAL_KEY} onKeyClick={null} />),
    ).not.toThrow();
  });

  test("highlights exactly the notes it's given", () => {
    render(
      <LinearKeyboardView
        musicalKey={DEFAULT_MUSICAL_KEY}
        highlightedNoteIndices={toNoteIndices([0, 4, 7])}
        onKeyClick={null}
      />,
    );
    keyVerificationUtils.verifySelectedLinearKeys([0, 4, 7]);
  });

  test("onKeyClick=null renders keys read-only - clicking doesn't throw", () => {
    render(<LinearKeyboardView musicalKey={DEFAULT_MUSICAL_KEY} onKeyClick={null} />);
    expect(() => ReactTestUtils.clickKey("linearKey00")).not.toThrow();
  });

  test("onKeyClick, when given, is called with the clicked key's index", () => {
    const onKeyClick = jest.fn();
    render(<LinearKeyboardView musicalKey={DEFAULT_MUSICAL_KEY} onKeyClick={onKeyClick} />);
    ReactTestUtils.clickKey("linearKey07");
    expect(onKeyClick).toHaveBeenCalledWith(ixActual(7));
  });

  test("isBassNote marks the matching key, and no other", () => {
    render(
      <LinearKeyboardView
        musicalKey={DEFAULT_MUSICAL_KEY}
        onKeyClick={null}
        isBassNote={(index) => index === ixActual(4)}
      />,
    );
    expect(document.getElementById("linearKey04")).toHaveClass("root-note");
    expect(document.getElementById("linearKey00")).not.toHaveClass("root-note");
  });

  test("isScales disables and mutes a note outside the key, leaves a diatonic note alone", () => {
    render(<LinearKeyboardView musicalKey={DEFAULT_MUSICAL_KEY} isScales onKeyClick={null} />);
    const tonic = document.getElementById("linearKey00")!; // C - diatonic in C major
    const nonDiatonic = document.getElementById("linearKey01")!; // C# - not in C major

    ReactTestUtils.expectElementToBeEnabled(tonic);
    expect(tonic).toHaveClass("bg-keys-bgHighlighted");

    ReactTestUtils.expectElementToBeDisabled(nonDiatonic);
    expect(nonDiatonic).toHaveClass("bg-keys-bgMuted");
  });
});
