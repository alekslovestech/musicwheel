import {
  getActiveLearnPlaybackId,
  playChord,
  playScale,
  stopLearnPlayback,
  subscribeLearnPlayback,
} from "@/lib/audio/learnPlayback";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ixActual } from "@/types/IndexTypes";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

const CHORD = [ixActual(0), ixActual(4), ixActual(7)];

describe("learnPlayback", () => {
  afterEach(() => {
    stopLearnPlayback();
  });

  test("a chord marks its figure active until stopped", async () => {
    await playChord("a", CHORD);
    expect(getActiveLearnPlaybackId()).toBe("a");

    stopLearnPlayback();
    expect(getActiveLearnPlaybackId()).toBeNull();
  });

  test("starting a second figure replaces the first", async () => {
    await playChord("a", CHORD);
    await playChord("b", CHORD);
    expect(getActiveLearnPlaybackId()).toBe("b");
  });

  test("a play superseded while still loading never becomes active", async () => {
    const first = playChord("a", CHORD);
    const second = playChord("b", CHORD);
    await Promise.all([first, second]);
    expect(getActiveLearnPlaybackId()).toBe("b");
  });

  test("stopping a scale runs its onEnd so the figure clears its highlight", async () => {
    const onEnd = jest.fn();
    await playScale(
      "scale",
      GreekTestConstants.getInstance().C_IONIAN_KEY,
      ScalePlaybackMode.SingleNote,
      jest.fn(),
      onEnd,
    );
    expect(getActiveLearnPlaybackId()).toBe("scale");

    stopLearnPlayback();
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(getActiveLearnPlaybackId()).toBeNull();
  });

  test("listeners hear every change", async () => {
    const listener = jest.fn();
    const unsubscribe = subscribeLearnPlayback(listener);

    await playChord("a", CHORD);
    stopLearnPlayback();
    unsubscribe();

    expect(listener).toHaveBeenCalled();
  });
});
