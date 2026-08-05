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
import { ActualIndex, InversionIndex, ixActual, NoteIndices } from "@/types/IndexTypes";
import { DEFAULT_MUSICAL_KEY, MusicalKey } from "@/types/Keys/MusicalKey";
import { useGlobalMode } from "@/lib/hooks/useGlobalMode";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { ChordReference, makeChordReference } from "@/types/interfaces/ChordReference";

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
  /** One sequence step's chord identity and notes, applied together - see the implementation. */
  setSelectionFromSequence: (notes: NoteIndices, chordRef?: ChordReference) => void;
}

const MusicalContext = createContext<MusicalSettings | null>(null);

const DEFAULT_HARMONY_CHORD_REF = makeChordReference(7, ChordType.Major, 0);

export const MusicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const globalMode = useGlobalMode();
  const [currentChordRef, setCurrentChordRef] = useState<ChordReference | undefined>(
    globalMode === GlobalMode.Harmony ? DEFAULT_HARMONY_CHORD_REF : undefined,
  );
  const [selectedNoteIndices, setSelectedNoteIndices] = useState<NoteIndices>([]);
  const [selectedMusicalKey, setSelectedMusicalKey] = useState<MusicalKey>(DEFAULT_MUSICAL_KEY);

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
      currentChordRef.inversionIndex,
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

  /**
   * Chord identity and notes in a single commit, so one playback step is one render: the staff
   * rebuilds once, and the audio - keyed off the notes - fires in the same commit that paints
   * them. Both must stay plain setState calls here; routing either through an intermediate
   * state or an effect splits the step across two commits and the sound leads the picture.
   */
  const setSelectionFromSequence = useCallback((notes: NoteIndices, chordRef?: ChordReference) => {
    setCurrentChordRef(chordRef);
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
    setSelectionFromSequence,
  };

  // Derives note indices from a chord reference, for the paths that set only the chord (presets,
  // inversion changes). Bails out when the notes already match, so a sequence step that set both
  // at once does not pay a second commit here - which would also re-trigger playback audio.
  useEffect(() => {
    if (!currentChordRef) return;

    const updatedIndices = ChordUtils.calculateChordNotesFromChordReference(currentChordRef);
    setSelectedNoteIndices((prev) =>
      IndexUtils.areIndicesEqual(prev, updatedIndices) ? prev : updatedIndices,
    );
  }, [currentChordRef]);

  return <MusicalContext.Provider value={value}>{children}</MusicalContext.Provider>;
};

export const useMusical = () => {
  const context = useContext(MusicalContext);
  if (!context) {
    throw new Error("useMusical must be used within a MusicalProvider");
  }
  return context;
};
