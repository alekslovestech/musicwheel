import { render } from "@testing-library/react";

import { CircularKeyboardView } from "@/components/Keyboard/Circular/CircularKeyboardView";
import { ixActual, toNoteIndices } from "@/types/IndexTypes";
import { DEFAULT_MUSICAL_KEY } from "@/types/Keys/MusicalKey";

import { keyVerificationUtils } from "@/tests/reactutils/KeyboardVerificationUtils";
import { ReactTestUtils } from "@/tests/reactutils/ReactTestUtils";


// The presentational core Learn figures render directly, with no RootProvider - these guard the
// configurations that make that safe (no context reads) and the ones the Learn figures actually
// use (read-only, and Harmony-mode shading). KeyboardCircular.test.tsx / KeyboardGeneral.test.tsx
// cover the live app's click-to-selection wiring, which lives in the adapter, not here.
describe("CircularKeyboardView", () => {
  test("renders with no provider - reads no context", () => {
    expect(() =>
      render(<CircularKeyboardView musicalKey={DEFAULT_MUSICAL_KEY} onKeyClick={null} />),
    ).not.toThrow();
  });

  test("highlights exactly the notes it's given", () => {
    render(
      <CircularKeyboardView
        musicalKey={DEFAULT_MUSICAL_KEY}
        highlightedNoteIndices={toNoteIndices([0, 4, 7])}
        onKeyClick={null}
      />,
    );
    keyVerificationUtils.verifySelectedCircularKeys([0, 4, 7]);
  });

  test("onKeyClick=null renders keys read-only - clicking doesn't throw", () => {
    render(<CircularKeyboardView musicalKey={DEFAULT_MUSICAL_KEY} onKeyClick={null} />);
    expect(() => ReactTestUtils.clickKey("circularKey00")).not.toThrow();
  });

  test("onKeyClick, when given, is called with the clicked key's index", () => {
    const onKeyClick = jest.fn();
    render(<CircularKeyboardView musicalKey={DEFAULT_MUSICAL_KEY} onKeyClick={onKeyClick} />);
    ReactTestUtils.clickKey("circularKey07");
    expect(onKeyClick).toHaveBeenCalledWith(ixActual(7));
  });

  test("isScales=true draws the tonic boundary flag", () => {
    const { container } = render(
      <CircularKeyboardView musicalKey={DEFAULT_MUSICAL_KEY} isScales onKeyClick={null} />,
    );
    expect(container.querySelector(".fill-keys-scaleBoundaryColor")).not.toBeNull();
  });

  test("isScales=false omits the tonic boundary flag", () => {
    const { container } = render(
      <CircularKeyboardView musicalKey={DEFAULT_MUSICAL_KEY} isScales={false} onKeyClick={null} />,
    );
    expect(container.querySelector(".fill-keys-scaleBoundaryColor")).toBeNull();
  });

  test("isBassNote marks the matching key, and no other", () => {
    render(
      <CircularKeyboardView
        musicalKey={DEFAULT_MUSICAL_KEY}
        onKeyClick={null}
        isBassNote={(index) => index === ixActual(4)}
      />,
    );
    expect(document.getElementById("circularKey04")).toHaveClass("root-note");
    expect(document.getElementById("circularKey00")).not.toHaveClass("root-note");
  });
});
