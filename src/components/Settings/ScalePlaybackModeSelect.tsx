"use client";
import React, { useState } from "react";
import { isChordalScalePlaybackMode, ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { useAudio } from "@/contexts/AudioContext";
import { TrackEvent } from "@/lib/tracking/events";
import { useTrack } from "@/lib/tracking/useTrack";
import { Button } from "@/components/Common/Button";
import { SectionTitle } from "@/components/Common/SectionTitle";
import { WheelShapeIcon } from "../Icons/WheelShapeIcon";

export const ScalePlaybackModeSelect: React.FC = () => {
  const trackAction = useTrack();
  const { scalePlaybackMode, setScalePlaybackMode, startSequencePlayback } = useAudio();
  // Remembered so leaving Chords and coming back returns you to the density you were on,
  // rather than silently demoting your sevenths to triads.
  const [lastDensityIsSeventh, setLastDensityIsSeventh] = useState(
    scalePlaybackMode === ScalePlaybackMode.Seventh,
  );
  const lastChordDensity = lastDensityIsSeventh
    ? ScalePlaybackMode.Seventh
    : ScalePlaybackMode.Triad;

  const isChordsSelected = isChordalScalePlaybackMode(scalePlaybackMode);

  const selectMode = (newMode: ScalePlaybackMode) => {
    // Fires on every click, including re-clicking the already-selected mode - a bare
    // "interacted" ping would tell us people touch this widget but not what they picked.
    trackAction(TrackEvent.ScalePlaybackModeChanged, { scale_playback_mode: newMode });
    if (newMode === scalePlaybackMode) return;
    setScalePlaybackMode(newMode);
    startSequencePlayback({ scalePlaybackMode: newMode });
  };

  const selectDensity = (isSeventh: boolean) => {
    setLastDensityIsSeventh(isSeventh);
    selectMode(isSeventh ? ScalePlaybackMode.Seventh : ScalePlaybackMode.Triad);
  };

  return (
    <div id="playback-mode-select" className="playback-mode-select flex flex-col items-center">
      <SectionTitle className="whitespace-nowrap">Playback Mode</SectionTitle>
      <div id="scale-playback-modes" className="flex gap-[2px]">
        <Button
          id="playback-notes"
          variant="option"
          size="sm"
          selected={scalePlaybackMode === ScalePlaybackMode.SingleNote}
          onClick={() => selectMode(ScalePlaybackMode.SingleNote)}
          title="Notes - the scale, plain"
        >
          {"♪" /* eighth note - one note played at a time */}
        </Button>
        <Button
          id="playback-drone"
          variant="option"
          size="sm"
          selected={scalePlaybackMode === ScalePlaybackMode.DronedSingleNote}
          onClick={() => selectMode(ScalePlaybackMode.DronedSingleNote)}
          title="Drone - same tonic, different scale"
        >
          {/* C to E: a Major 3rd, symbolic (not a tritone); dot marks the tonic */}
          <WheelShapeIcon indices={[0, 4]} dotIndex={0} />
        </Button>
        <Button
          id="playback-chords"
          variant="option"
          size="sm"
          selected={isChordsSelected}
          onClick={() => selectMode(lastChordDensity)}
          title="Chords - same chords, different home"
        >
          {/* evenly spaced (not a real triad's actual notes) so the shape reads as a clean triangle */}
          <WheelShapeIcon indices={[0, 4, 8]} />
        </Button>
      </div>
      {isChordsSelected && (
        <div id="chord-density-select" className="mt-tight flex h-6 items-center gap-[2px]">
          <ChordDensityChip
            label="3"
            description="Triads (3-note chords)"
            selected={scalePlaybackMode === ScalePlaybackMode.Triad}
            onClick={() => selectDensity(false)}
          />
          <ChordDensityChip
            label="4"
            description="Sevenths (4-note chords)"
            selected={scalePlaybackMode === ScalePlaybackMode.Seventh}
            onClick={() => selectDensity(true)}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Deliberately smaller and flatter than the mode buttons: triads and sevenths are two densities
 * of one idea, not a fourth peer mode, and the control should read as subordinate to Chords.
 */
function ChordDensityChip({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  const selectedStyles = selected
    ? "bg-buttons-bgSelected border-buttons-borderSelected text-buttons-textSelected"
    : "bg-buttons-bgDefault border-buttons-border text-labels-textDefault hover:bg-buttons-bgHover";

  return (
    <button
      id={`chord-density-${label}`}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      title={description}
      className={`h-6 min-w-6 rounded-md border px-snug text-xs transition-colors ${selectedStyles}`}
    >
      {label}
    </button>
  );
}
