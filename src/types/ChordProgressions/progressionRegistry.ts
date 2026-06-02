import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { KeyType } from "@/types/enums/KeyType";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import AndalusianCadenceChords from "./songs/Andalusian_Cadence";
import AllIWantForChristmasChords from "./songs/All_I_Want_For_Christmas";
import AroundTheWorldChords from "./songs/Around_The_World";
import FiftiesProgressionChords from "./songs/Fifties_Progression";
import BohemianRhapsodyMamaChords from "./songs/Bohemian_Rhapsody_Mama";
import CarelessWhisperChords from "./songs/Careless_Whisper";
import CreepChords from "./songs/Creep";
import GypsyWomanChords from "./songs/Gypsy_Woman";
import LetItBeChords from "./songs/LetItBe";
import LetItBeIntermissionChords from "./songs/LetItBe_Intermission";
import LineClicheChords from "./songs/Line_Cliche";
import MichelleChords from "./songs/Michelle";
import PerfectCadenceChords from "./songs/Perfect_Cadence";
import PlagalCadenceChords from "./songs/Plagal_Cadence";
import SomethingChords from "./songs/Something";
import TheWorldIsNotEnoughChords from "./songs/The_World_Is_Not_Enough";
import TwoFiveOneChords from "./songs/Two_Five_One";
import WithOrWithoutYouChords from "./songs/WithOrWithoutYou";

export interface ProgressionRegistryEntry {
  slug: string;
  chords: string;
  isPattern: boolean;
  tempo?: number;
  suggestedMusicalKey?: MusicalKey;
}

export const PROGRESSION_REGISTRY: Record<ChordProgressionType, ProgressionRegistryEntry> = {
  [ChordProgressionType.Plagal_Cadence]: {
    slug: "plagal-cadence",
    chords: PlagalCadenceChords,
    isPattern: true,
  },
  [ChordProgressionType.Perfect_Cadence]: {
    slug: "perfect-cadence",
    chords: PerfectCadenceChords,
    isPattern: true,
  },
  [ChordProgressionType.Line_Cliche]: {
    slug: "line-cliche",
    chords: LineClicheChords,
    isPattern: true,
  },
  [ChordProgressionType.Fifties_Progression]: {
    slug: "50s-progression",
    chords: FiftiesProgressionChords,
    isPattern: true,
  },
  [ChordProgressionType.Two_Five_One]: {
    slug: "2-5-1",
    chords: TwoFiveOneChords,
    isPattern: true,
  },
  [ChordProgressionType.Andalusian_Cadence]: {
    slug: "andalusian-cadence",
    chords: AndalusianCadenceChords,
    isPattern: true,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("A", KeyType.Minor),
  },
  [ChordProgressionType.Gypsy_Woman]: {
    slug: "gypsy-woman",
    chords: GypsyWomanChords,
    isPattern: false,
    tempo: 120,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("F", KeyType.Major),
  },
  [ChordProgressionType.Around_The_World]: {
    slug: "around-the-world",
    chords: AroundTheWorldChords,
    isPattern: false,
    tempo: 120,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("A", KeyType.Minor),
  },
  [ChordProgressionType.LetItBe]: {
    slug: "let-it-be",
    chords: LetItBeChords,
    isPattern: false,
    tempo: 102,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("C", KeyType.Major),
  },
  [ChordProgressionType.LetItBe_Intermission]: {
    slug: "let-it-be-intermission",
    chords: LetItBeIntermissionChords,
    isPattern: false,
    tempo: 102,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("C", KeyType.Major),
  },
  [ChordProgressionType.WithOrWithoutYou]: {
    slug: "with-or-without-you",
    chords: WithOrWithoutYouChords,
    isPattern: false,
    tempo: 110,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("D", KeyType.Major),
  },
  [ChordProgressionType.Something]: {
    slug: "something",
    chords: SomethingChords,
    isPattern: false,
    tempo: 133,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("C", KeyType.Major),
  },

  [ChordProgressionType.Creep]: {
    slug: "creep",
    chords: CreepChords,
    isPattern: false,
    tempo: 92,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("G", KeyType.Major),
  },
  [ChordProgressionType.The_World_Is_Not_Enough]: {
    slug: "the-world-is-not-enough",
    chords: TheWorldIsNotEnoughChords,
    isPattern: false,
    tempo: 86,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("F", KeyType.Minor),
  },
  [ChordProgressionType.All_I_Want_For_Christmas]: {
    slug: "all-i-want-for-christmas",
    chords: AllIWantForChristmasChords,
    isPattern: false,
    tempo: 150,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("G", KeyType.Major),
  },
  [ChordProgressionType.Careless_Whisper]: {
    slug: "careless-whisper",
    chords: CarelessWhisperChords,
    isPattern: false,
    tempo: 76,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("D", KeyType.Minor),
  },
  [ChordProgressionType.Michelle]: {
    slug: "michelle",
    chords: MichelleChords,
    isPattern: false,
    tempo: 72,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("F", KeyType.Minor),
  },
  [ChordProgressionType.Bohemian_Rhapsody_Mama]: {
    slug: "bohemian-rhapsody-mama",
    chords: BohemianRhapsodyMamaChords,
    isPattern: false,
    tempo: 72,
    suggestedMusicalKey: MusicalKey.fromClassicalMode("Bb", KeyType.Major),
  },
};

export const PROGRESSION_SLUG_MAP = Object.fromEntries(
  Object.entries(PROGRESSION_REGISTRY).map(([type, entry]) => [entry.slug, type]),
) as Record<string, ChordProgressionType>;
