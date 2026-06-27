import { ph } from "./ph";

import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { HarmonyInputMode } from "@/types/enums/HarmonyInputMode";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { TransposeTarget } from "@/types/enums/TransposeTarget";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { NoteGroupingId } from "@/types/NoteGroupingId";

export type TrackCtx = {
  global_mode?: GlobalMode;
  harmony_input_mode?: HarmonyInputMode;
  scale_type?: ScaleModeType;
  progression_type?: ChordProgressionType | null;
  keyboard_ui?: KeyboardUIType;
  scale_playback_mode?: ScalePlaybackMode;
  preset_id?: NoteGroupingId;
  transpose_target?: TransposeTarget;
};

type ModeContextInput = {
  globalMode: GlobalMode;
  scaleType: ScaleModeType;
  harmonyInputMode: HarmonyInputMode;
  progressionType: ChordProgressionType | null;
};

/** Shared mode context — attach to every user interaction. */
export function buildModeContext({
  globalMode,
  scaleType,
  harmonyInputMode,
  progressionType,
}: ModeContextInput): Pick<
  TrackCtx,
  "global_mode" | "scale_type" | "harmony_input_mode" | "progression_type"
> {
  return {
    global_mode: globalMode,
    ...(globalMode === GlobalMode.Scales && { scale_type: scaleType }),
    ...(globalMode === GlobalMode.Harmony && { harmony_input_mode: harmonyInputMode }),
    ...(globalMode === GlobalMode.ChordProgressions && {
      progression_type: progressionType,
    }),
  };
}

export function track(name: string, props: TrackCtx = {}) {
  if (ph.__loaded) {
    ph.capture(name, props);
  } else {
    console.warn("[TRACK] PostHog not loaded, event not sent");
  }
}
