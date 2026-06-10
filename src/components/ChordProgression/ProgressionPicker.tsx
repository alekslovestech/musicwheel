"use client";

import { Select } from "../Common/Select";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { PROGRESSION_REGISTRY } from "@/types/ChordProgressions/progressionRegistry";

const PROGRESSION_GROUPS: { label: string; isPattern: boolean }[] = [
  { label: "Patterns & cadences", isPattern: true },
  { label: "Songs", isPattern: false },
];

export function ProgressionPicker({
  selectedProgression,
  onProgressionChange,
}: {
  selectedProgression: ChordProgressionType | null;
  onProgressionChange: (progression: ChordProgressionType) => void;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "") return;
    onProgressionChange(value as ChordProgressionType);
  };

  return (
    <Select
      id="progression-picker"
      value={selectedProgression ?? ""}
      onChange={handleChange}
      title="Select chord progression"
      className="w-full max-w-full shrink-0"
    >
      <option value="" disabled>
        Select chord progression
      </option>
      {PROGRESSION_GROUPS.map(({ label, isPattern }) => (
        <optgroup key={String(isPattern)} label={label}>
          {Object.values(ChordProgressionType)
            .filter((type) => PROGRESSION_REGISTRY[type].isPattern === isPattern)
            .map((type) => (
              <option id={`progression-picker-option-${type}`} key={type} value={type}>
                {type}
              </option>
            ))}
        </optgroup>
      ))}
    </Select>
  );
}
