"use client";
import React from "react";

import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { isMajor } from "@/types/enums/KeyType";
import { KeySignature } from "@/types/Keys/KeySignature";

import { useMusical } from "@/contexts/MusicalContext";

import { Button } from "./Common/Button";
import { Select } from "./Common/Select";

export const MusicalKeySelector = ({ useDropdownSelector }: { useDropdownSelector: boolean }) => {
  const { selectedMusicalKey, setSelectedMusicalKey } = useMusical();

  //C / C# / Db / D / D# / Eb / E / F / F# / Gb / G / G# / Ab / A / A# / Bb / B
  const handleTonicNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tonicName = event.target.value as string;

    const newKey = useDropdownSelector
      ? MusicalKey.fromGreekMode(tonicName, selectedMusicalKey.scaleMode)
      : MusicalKey.fromClassicalMode(tonicName, selectedMusicalKey.classicalMode);
    setSelectedMusicalKey(newKey);
  };

  //Ionian / Dorian / Phrygian / Lydian / Mixolydian / Aeolian / Locrian
  const handleGreekModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const greekMode = event.target.value as ScaleModeType;
    const newKey = MusicalKey.fromGreekMode(selectedMusicalKey.tonicString, greekMode);
    setSelectedMusicalKey(newKey);
  };

  //Major / Minor
  const handleMajorMinorToggle = (isMajorSelected: boolean) => {
    const currentIsMajor = isMajor(selectedMusicalKey.classicalMode);
    // Only toggle if we're selecting a different mode
    if (isMajorSelected !== currentIsMajor) {
      const newKey = selectedMusicalKey.getOppositeKey();
      setSelectedMusicalKey(newKey);
    }
  };

  const currentIsMajor = isMajor(selectedMusicalKey.classicalMode);

  const TonicSelector = () => (
    <Select
      id="tonic-select"
      value={selectedMusicalKey.tonicString}
      onChange={handleTonicNameChange}
      title="Select tonic note (scale start)"
    >
      {KeySignature.getKeyList(selectedMusicalKey.classicalMode).map((note) => (
        <option key={note} value={note}>
          {note}
        </option>
      ))}
    </Select>
  );

  return (
    <div className="musical-key-selector text-sm font-medium">
      {useDropdownSelector ? (
        <div className="flex flex-col gap-2">
          <TonicSelector />
          <Select
            id="greek-mode-select"
            value={selectedMusicalKey.scaleMode}
            onChange={handleGreekModeChange}
            title="Select musical mode"
          >
            {Object.values(ScaleModeType).map((mode) => (
              <option id={`greek-mode-option-${mode}`} key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </Select>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <TonicSelector />
          <div className="major-minor-selector flex gap-2">
            <Button
              id="major-button"
              variant="option"
              size="sm"
              selected={currentIsMajor}
              onClick={() => handleMajorMinorToggle(true)}
              title="Select major mode"
            >
              Major
            </Button>
            <Button
              id="minor-button"
              variant="option"
              size="sm"
              selected={!currentIsMajor}
              onClick={() => handleMajorMinorToggle(false)}
              title="Select minor mode"
            >
              Minor
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
