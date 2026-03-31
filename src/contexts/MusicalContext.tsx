"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

import { ChordType } from "@/types/enums/ChordType";
import {
  ActualIndex,
  InversionIndex,
  ixActual,
  toNoteIndices,
  NoteIndices,
} from "@/types/IndexTypes";
import { DEFAULT_MUSICAL_KEY, MusicalKey } from "@/types/Keys/MusicalKey";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import {
  ChordReference,
  makeChordReference,
} from "@/types/interfaces/ChordReference";

import { ChordUtils } from "@/utils/ChordUtils";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { IndexUtils } from "@/utils/IndexUtils";

export interface MusicalSettings {
  selectedNoteIndices: NoteIndices; // Read-only
  selectedMusicalKey: MusicalKey;
  currentChordRef?: ChordReference;
  setSelectedMusicalKey: (key: MusicalKey) => void;
  setCurrentChordRef: (chordRef?: ChordReference) => void;
  setChordRootNote: (rootNote: ActualIndex) => void;
  setChordType: (chordType: NoteGroupingId) => void;
  setChordInversion: (inversionIndex: InversionIndex) => void;
  setChordBassNote: (bassNote: ActualIndex) => void;

  // Freeform-only operations
  toggleNote: (note: ActualIndex) => void;
  clearNotes: () => void;
  setNotesDirectly: (notes: NoteIndices) => void; // For transpose, etc.
}

const MusicalContext = createContext<MusicalSettings | null>(null);

export const MusicalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isScales = useIsScalePreviewMode();
  const [selectedNoteIndices, setSelectedNoteIndices] = useState<NoteIndices>(
    isScales ? [] : toNoteIndices([7, 11, 14])
  );
  const [selectedMusicalKey, setSelectedMusicalKey] =
    useState<MusicalKey>(DEFAULT_MUSICAL_KEY);
  const [currentChordRef, setCurrentChordRef] = useState<
    ChordReference | undefined
  >(
    // Create initial chord reference to match the initial notes [7, 11, 14] = G major
    isScales ? undefined : makeChordReference(7, ChordType.Major, 0) // G major root position
  );

  const setChordRootNote = (rootNote: ActualIndex) => {
    if (!currentChordRef) return;
    setCurrentChordRef({
      ...currentChordRef,
      rootNote,
    });
  };

  const setChordType = (id: NoteGroupingId) => {
    if (!currentChordRef) return;
    setCurrentChordRef({
      ...currentChordRef,
      id,
    });
  };

  const setChordInversion = (inversionIndex: InversionIndex) => {
    if (!currentChordRef) return;
    setCurrentChordRef({
      ...currentChordRef,
      inversionIndex,
    });
  };

  const setChordBassNote = (bassNote: ActualIndex) => {
    if (!currentChordRef) return;

    // Calculate what the root note should be for this bass note
    const chordOffsets = ChordUtils.getOffsetsFromIdAndInversion(
      currentChordRef.id,
      currentChordRef.inversionIndex
    );
    const bassOffset = chordOffsets[0];
    const newRootNote = ixActual(bassNote - bassOffset);

    // update the chord reference - let useEffect handle note indices
    setCurrentChordRef({
      ...currentChordRef,
      rootNote: newRootNote,
    });
  };

  const toggleNote = useCallback((note: ActualIndex) => {
    setSelectedNoteIndices((prev) => IndexUtils.ToggleNewIndex(prev, note));
  }, []);

  const clearNotes = useCallback(() => {
    setSelectedNoteIndices([]);
  }, []);

  const setNotesDirectly = useCallback((notes: NoteIndices) => {
    // Only allow in freeform mode or for system operations
    setSelectedNoteIndices(notes);
  }, []);

  const value: MusicalSettings = {
    selectedNoteIndices,
    selectedMusicalKey,
    currentChordRef,
    setSelectedMusicalKey,
    setCurrentChordRef,
    setChordRootNote,
    setChordType,
    setChordInversion,
    setChordBassNote,
    toggleNote,
    clearNotes,
    setNotesDirectly,
  };

  // This useEffect will automatically calculate note indices from chord reference
  useEffect(() => {
    if (!currentChordRef) return;

    const updatedIndices =
      ChordUtils.calculateChordNotesFromChordReference(currentChordRef);
    setSelectedNoteIndices(updatedIndices);
  }, [currentChordRef]);

  return (
    <MusicalContext.Provider value={value}>{children}</MusicalContext.Provider>
  );
};

export const useMusical = () => {
  const context = useContext(MusicalContext);
  if (!context) {
    throw new Error("useMusical must be used within a MusicalProvider");
  }
  return context;
};
