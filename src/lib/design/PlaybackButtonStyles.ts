// Size lives on the icon itself (IconBase, in components/Icons) since every real caller uses
// the same frame - these are color only.
export const PLAYBACK_BUTTON_STYLES = {
  scalesMode: "text-playback-scalesMode",
  defaultMode: "text-playback-defaultMode", // For consistency with PlayNotesButton
} as const;
