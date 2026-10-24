import { LEARN_STYLES } from "@/lib/design";

/** A roman numeral chord symbol inline in Learn prose (e.g. "I", "vii°", "V7") - bold, so it
 * doesn't read as a plain letter. */
export function Roman({ children }: { children: React.ReactNode }) {
  return <strong className={LEARN_STYLES.romanNumeral}>{children}</strong>;
}
