"use client";
import { useEffect } from "react";
import { HarmonyInputMode } from "@/types/enums/HarmonyInputMode";
import { CircularVisMode } from "@/types/enums/SettingModes";

import { useDisplay } from "@/contexts/DisplayContext";
import { useChordPresets } from "@/contexts/ChordPresetContext";

import { CircularVisModeButton } from "@/components/Buttons/CircularVisModeButton";

export const CircularVisModeSelect: React.FC = () => {
  const { harmonyInputMode } = useChordPresets();
  const { setCircularVisMode } = useDisplay();

  useEffect(() => {
    switch (harmonyInputMode) {
      case HarmonyInputMode.SingleNote:
        setCircularVisMode(CircularVisMode.None);
        break;
      case HarmonyInputMode.IntervalPresets:
        setCircularVisMode(CircularVisMode.Radial);
        break;
      case HarmonyInputMode.ChordPresets:
        setCircularVisMode(CircularVisMode.Polygon);
        break;
      case HarmonyInputMode.Freeform:
        setCircularVisMode(CircularVisMode.Polygon);
        break;
    }
  }, [harmonyInputMode, setCircularVisMode]);

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
