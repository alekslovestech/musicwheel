import { ChromaticIndex } from "@/types/ChromaticIndex";
import { MusicalKey } from "@/types/Keys/MusicalKey";

interface KeyColors {
  primary: string; // "fill-keys-bgWhite" or "bg-keys-bgWhite"
  text: string; // "fill-keys-textOnWhite" or "text-keys-textOnWhite"
  border: string; // "border-keys-borderColor"
}

export class VisualStateUtils {
  static getKeyColors(
    chromaticIndex: ChromaticIndex,
    isScales: boolean,
    musicalKey: MusicalKey,
    isRootNote: boolean,
    isBlack: boolean,
    isSelected: boolean,
    isSvg: boolean,
  ): KeyColors {
    const border = this.getBorder(isRootNote);

    if (!isScales) {
      const { primary, text } = this.blackWhiteColors(isBlack, isSelected, isSvg);
      return { primary, text, border };
    }

    const isDiatonic = musicalKey.isDiatonicNote(chromaticIndex);
    const stateColor = isDiatonic ? "Highlighted" : "Muted";
    const selectedString = isSelected ? "Selected" : "";
    const primaryPrefix = this.getBgPrefix(isSvg);
    const textPrefix = this.getTextPrefix(isSvg);

    return {
      primary: `${primaryPrefix}-keys-bg${stateColor}${selectedString}`,
      text: `${textPrefix}-keys-textOn${stateColor}`,
      border,
    };
  }

  /**
   * Realistic black/white keys (see PianoKeyLinear's useRealisticColors), three tiers: plain,
   * in-scale (soft accent), and the specific interval a figure is spotlighting (navy - the wheel's
   * own Highlighted/HighlightedSelected color).
   */
  static getRealisticScaleKeyColors(
    isBlack: boolean,
    isDiatonic: boolean,
    isSelected: boolean,
    isRootNote: boolean,
    isSvg: boolean,
  ): KeyColors {
    const border = this.getBorder(isRootNote);
    const primaryPrefix = this.getBgPrefix(isSvg);

    if (isSelected) {
      return {
        primary: `${primaryPrefix}-keys-bgHighlightedSelected`,
        text: `${this.getTextPrefix(isSvg)}-keys-textOnHighlighted`,
        border,
      };
    }

    // Muted gray rather than full black: stays darker than a white key but doesn't compete with
    // the navy "specific interval" tier.
    if (isBlack && !isDiatonic) {
      return {
        primary: `${primaryPrefix}-keys-bgBlackMuted`,
        text: this.getTextColorClassForNonScaleMode(false, isBlack, isSvg),
        border,
      };
    }

    const { primary, text } = this.blackWhiteColors(isBlack, isDiatonic, isSvg);
    return { primary, text, border };
  }

  static getTextColorClassForNonScaleMode(
    isSelected: boolean,
    isBlack: boolean,
    isSvg: boolean,
  ): string {
    const prefix = this.getTextPrefix(isSvg);
    const state = isSelected ? "Selected" : "Faded";
    const keyType = isBlack ? "Black" : "White";
    return `${prefix}-keys-textOn${keyType}${state}`;
  }

  /** Plain black/white key, with an accent (Selected variant) when isAccented. Shared shape behind
   * getKeyColors's Harmony-mode branch and getRealisticScaleKeyColors's default branch - they
   * differ only in what drives the accent (current selection vs. scale membership). */
  private static blackWhiteColors(
    isBlack: boolean,
    isAccented: boolean,
    isSvg: boolean,
  ): { primary: string; text: string } {
    const primaryPrefix = this.getBgPrefix(isSvg);
    const keyType = isBlack ? "Black" : "White";
    const suffix = isAccented ? "Selected" : "";
    return {
      primary: `${primaryPrefix}-keys-bg${keyType}${suffix}`,
      text: this.getTextColorClassForNonScaleMode(isAccented, isBlack, isSvg),
    };
  }

  private static getBorder(isRootNote: boolean): string {
    return `border-${isRootNote ? "keys-borderRootNote" : "keys-borderColor"}`;
  }

  private static getBgPrefix(isSvg: boolean): string {
    return isSvg ? "fill" : "bg";
  }

  private static getTextPrefix(isSvg: boolean): string {
    return isSvg ? "fill" : "text";
  }
}
