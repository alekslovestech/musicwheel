export const TrackEvent = {
  KeyboardInteracted: "keyboard_interacted", //linear or circular keyboards
  TransposeInteracted: "transpose_interacted", //transpose widget
  SequencePlaybackInteracted: "sequence_playback_interacted",
  ColorLegendInteracted: "color_legend_interacted",
  ScaleTonicInteracted: "scale_tonic_interacted", // tonic dropdown
  ScaleRibbonStepInteracted: "scale_ribbon_step_interacted",
  ScaleStepAnnotationsToggled: "scale_step_annotations_toggled", // W-H overlay on the Notes ribbon

  ScaleTypeChanged: "scale_type_changed", //scale dropdown
  ScalePlaybackModeChanged: "scale_playback_mode_changed",
  ChordPresetChanged: "chord_preset_changed",
} as const;
