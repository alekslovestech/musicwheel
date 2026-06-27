import { ph } from "./ph";

import { InputMode } from "@/types/enums/InputMode";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { TransposeTarget } from "@/types/enums/TransposeTarget";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { NoteGroupingId } from "@/types/NoteGroupingId";

type Ctx = {
  global_mode?: GlobalMode;
  input_mode?: InputMode;
  keyboard_ui?: KeyboardUIType;
  scale_type?: ScaleModeType;
  scale_playback_mode?: ScalePlaybackMode;
  preset_id?: NoteGroupingId;
  transpose_target?: TransposeTarget;
};

export function track(name: string, props: Ctx = {}) {
  if (ph.__loaded) {
    ph.capture(name, props);
  } else {
    console.warn("[TRACK] PostHog not loaded, event not sent");
  }
}
