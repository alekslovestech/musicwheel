"use client";
import { useEffect } from "react";
import { InputMode } from "@/types/enums/InputMode";
import { CircularVisMode } from "@/types/enums/SettingModes";

import { useDisplay } from "@/contexts/DisplayContext";
import { useChordPresets } from "@/contexts/ChordPresetContext";

import { CircularVisModeButton } from "@/components/Buttons/CircularVisModeButton";

export const CircularVisModeSelect: React.FC = () => {
  const { inputMode } = useChordPresets();
  const { setCircularVisMode } = useDisplay();

  useEffect(() => {
    // Reset visualization mode when input mode changes
    switch (inputMode) {
      case InputMode.SingleNote:
        setCircularVisMode(CircularVisMode.None);
        break;
      case InputMode.IntervalPresets:
        setCircularVisMode(CircularVisMode.Radial);
        break;
      case InputMode.ChordPresets:
        setCircularVisMode(CircularVisMode.Polygon);
        break;
      case InputMode.Freeform:
        setCircularVisMode(CircularVisMode.Polygon);
        break;
    }
  }, [inputMode, setCircularVisMode]);

  const visList = [
    {
      mode: CircularVisMode.None,
      label: "No visualization",
    },
    {
      mode: CircularVisMode.Radial,
      label: "Radial visualization",
    },
    {
      mode: CircularVisMode.Polygon,
      label: "Polygon visualization",
    },
  ];

  return (
    <div className="flex flex-nowrap gap-tight">
      {visList.map(({ mode, label }) => (
        <CircularVisModeButton key={mode} mode={mode} label={label} />
      ))}
    </div>
  );
};
