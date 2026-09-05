import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const replaceMock = jest.fn();
const paramsMock = { tonic: "c", mode: "aeolian" };

/**
 * next/navigation's useSearchParams() is not guaranteed to return the same object reference
 * across renders where the route hasn't actually changed - this mock deliberately returns a
 * fresh instance every call to catch code that (incorrectly) depends on that object's identity
 * instead of its string content.
 */
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, push: jest.fn() }),
  useParams: () => paramsMock,
  usePathname: () => `/scales/${paramsMock.tonic}/${paramsMock.mode}`,
  useSearchParams: () => new URLSearchParams("play=single"),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import { RootProvider } from "@/contexts/RootContext";
import { MusicalKeySelector } from "@/components/MusicalKeySelector";
import { useScaleSlugPage } from "@/lib/hooks/useSlugUrlSync";

function Harness() {
  useScaleSlugPage();
  return <MusicalKeySelector useDropdownSelector={true} />;
}

describe("useScaleSlugPage tonic sync", () => {
  it("pushes the new URL when the tonic changes, without reverting the selection", () => {
    paramsMock.tonic = "c";
    paramsMock.mode = "aeolian";
    render(
      <RootProvider>
        <Harness />
      </RootProvider>,
    );
    replaceMock.mockClear();

    const tonicSelect = document.getElementById("tonic-select") as HTMLSelectElement;
    fireEvent.change(tonicSelect, { target: { value: "C#" } });

    expect(replaceMock).toHaveBeenCalledWith("/scales/c-sharp/aeolian?play=single");
  });

  it("respells the tonic when switching to a mode in the other classicalMode", () => {
    // Db isn't a legal minor tonic - switching Db Ionian to Aeolian must land on C# Aeolian,
    // not silently keep "Db" attached to a minor key (which no part of the app considers legal).
    paramsMock.tonic = "d-flat";
    paramsMock.mode = "ionian";
    render(
      <RootProvider>
        <Harness />
      </RootProvider>,
    );
    replaceMock.mockClear();

    const modeSelect = document.getElementById("scale-mode-select") as HTMLSelectElement;
    fireEvent.change(modeSelect, { target: { value: "Aeolian" } });

    expect(replaceMock).toHaveBeenCalledWith("/scales/c-sharp/aeolian?play=single");
  });
});
