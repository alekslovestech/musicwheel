import { KeyTier } from "@/types/enums/KeyTier";

interface KeyColors {
  primary: string; // "fill-keys-bgWhite" or "bg-keys-bgWhite"
  text: string; // "fill-keys-textOnWhiteFaded" or "text-keys-textOnWhiteFaded"
  border: string; // "border-keys-borderColor"
}

export class VisualStateUtils {
  // Colors for a key at the given tier. Only Plain depends on black vs. white for its fill;
  // Muted, Active and Spotlight are the same on either, so their labels are too.
  static getKeyColors(
    tier: KeyTier,
    isBlack: boolean,
    isRootNote: boolean,
    isSvg: boolean,
  ): KeyColors {
    return {
      primary: `${this.getBgPrefix(isSvg)}-keys-${this.getBgToken(tier, isBlack)}`,
      text: this.getKeyTextColor(tier, isBlack, isSvg),
      border: `border-${isRootNote ? "keys-borderRootNote" : "keys-borderColor"}`,
    };
  }

  static getKeyTextColor(tier: KeyTier, isBlack: boolean, isSvg: boolean): string {
    const prefix = this.getTextPrefix(isSvg);
    switch (tier) {
      case KeyTier.Active:
        return `${prefix}-keys-textOnActive`;
      case KeyTier.Spotlight:
        return `${prefix}-keys-textOnSpotlight`;
      case KeyTier.Muted:
        return `${prefix}-keys-textOnMuted`;
      default:
        return `${prefix}-keys-textOn${isBlack ? "Black" : "White"}Faded`;
    }
  }

  private static getBgToken(tier: KeyTier, isBlack: boolean): string {
    switch (tier) {
      case KeyTier.Active:
        return "bgActive";
      case KeyTier.Spotlight:
        return "bgSpotlight";
      case KeyTier.Muted:
        return "bgMuted";
      default:
        return isBlack ? "bgBlack" : "bgWhite";
    }
  }

  private static getBgPrefix(isSvg: boolean): string {
    return isSvg ? "fill" : "bg";
  }

  private static getTextPrefix(isSvg: boolean): string {
    return isSvg ? "fill" : "text";
  }
}
