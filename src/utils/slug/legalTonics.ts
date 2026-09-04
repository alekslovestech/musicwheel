import { KeyType } from "@/types/enums/KeyType";
import { KeySignature } from "@/types/Keys/KeySignature";

/** The tonics a classical (major/minor) key family can legally take - one canonical spelling per
 * pitch class. */
export function legalTonicsForClassicalMode(classicalMode: KeyType): string[] {
  return KeySignature.getKeyList(classicalMode);
}

export function isLegalTonicForClassicalMode(tonic: string, classicalMode: KeyType): boolean {
  return legalTonicsForClassicalMode(classicalMode).includes(tonic);
}
