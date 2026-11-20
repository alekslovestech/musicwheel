import {
  ensureToneContextRunning,
  initAudioEngine,
  isAudioReady,
  playNotesNow,
} from "@/lib/audio/audioEngine";
import { resolveClickProfile } from "@/lib/audio/playbackProfiles";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ixActual } from "@/types/IndexTypes";

describe("audioEngine", () => {
  test("initAudioEngine is idempotent and leaves the engine ready", () => {
    initAudioEngine();
    initAudioEngine();
    expect(isAudioReady()).toBe(true);
  });

  test("a running context reports ready", async () => {
    await expect(ensureToneContextRunning()).resolves.toBe(true);
  });

  test("playNotesNow sounds the notes once the pool exists", () => {
    initAudioEngine();
    const profile = resolveClickProfile(ScalePlaybackMode.SingleNote, false);
    expect(playNotesNow([ixActual(0), ixActual(4)], profile.durationSec, profile.envelope)).toBe(
      true,
    );
  });
});
