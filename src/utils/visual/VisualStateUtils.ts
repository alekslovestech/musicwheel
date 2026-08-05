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
    // Determine state color based on context
    const isDiatonic = musicalKey.scaleModeInfo.isDiatonicNote(
      chromaticIndex,
      musicalKey.tonicIndex,
    );

    const stateColor = isScales
      ? isDiatonic
        ? "Highlighted"
        : "Muted"
      : isBlack
        ? "Black"
        : "White";

    const selectedString = isSelected ? "Selected" : "";

    // Build CSS classes
    const primaryPrefix = isSvg ? "fill" : "bg";
    const textPrefix = this.getTextPrefix(isSvg);

    const primary = `${primaryPrefix}-keys-bg${stateColor}${selectedString}`;
    const border = `border-${isRootNote ? "keys-borderRootNote" : "keys-borderColor"}`;

    // Determine text color - always use Selected or Faded variants
    // For scale mode, use Highlighted/Muted colors (no Selected/Faded variants)
    // For non-scale mode, use White/Black with Selected or Faded suffix
    let text: string;
    if (isScales) {
      // Scale mode uses Highlighted/Muted colors (no Selected/Faded variants)
      text = `${textPrefix}-keys-textOn${stateColor}`;
    } else {
      // Non-scale mode: always use Selected or Faded variant
      text = this.getTextColorClassForNonScaleMode(isSelected, isBlack, isSvg);
    }

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

  private static getTextPrefix(isSvg: boolean): string {
    return isSvg ? "fill" : "text";
  }
}
