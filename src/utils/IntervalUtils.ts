import { ChromaticIndex, makeChromaticIndex, subChromatic } from "@/types/ChromaticIndex";
import { NoteIndices } from "@/types/IndexTypes";
import { IntervalDistance, ixIntervalDistance } from "@/types/IntervalClass";
export class IntervalUtils {
  static cyclicIntervalsFromActualIndices(indices: NoteIndices): IntervalDistance[] {
    const pcs = indices.map((index) => makeChromaticIndex(index));
    const sortedPcs = pcs.sort((a, b) => a - b);
    return this.cyclicIntervals(sortedPcs);
  }

  // Start of the lexicographically smallest rotation, so every rotation of the same gaps agrees.
  // Equal rotations are interchangeable.
  private static canonicalStartIndex(intervals: IntervalDistance[]): number {
    const len = intervals.length;
    let best = 0;
    for (let start = 1; start < len; start++) {
      for (let k = 0; k < len; k++) {
        const candidate = intervals[(start + k) % len];
        const current = intervals[(best + k) % len];
        if (candidate === current) continue;
        if (candidate < current) best = start;
        break;
      }
    }
    return best;
  }

  private static cyclicIntervals(sortedPcs: ChromaticIndex[]): IntervalDistance[] {
    if (sortedPcs.length <= 1) return [];

    const intervals: IntervalDistance[] = [];
    const len = sortedPcs.length;

    for (let i = 0; i < len; i++) {
      const current = sortedPcs[i];
      const next = sortedPcs[(i + 1) % len];
      const diff = ixIntervalDistance(subChromatic(next, current));
      intervals.push(diff);
    }

    const startIndex = this.canonicalStartIndex(intervals);

    const reordered: IntervalDistance[] = [];
    for (let i = 0; i < len; i++) {
      reordered.push(intervals[(startIndex + i) % len]);
    }

    if (len >= 4) {
      const diagonalIntervals: IntervalDistance[] = [];
      const diagonalCount = Math.floor(len / 2);
      for (let i = 0; i < diagonalCount; i++) {
        const currentInterval = intervals[(startIndex + i) % len];
        const nextInterval = intervals[(startIndex + i + 1) % len];
        const semitones = (currentInterval + nextInterval) as IntervalDistance;
        diagonalIntervals.push(semitones);
      }
      diagonalIntervals.sort((a, b) => a - b);
      reordered.push(...diagonalIntervals);
    }

    return reordered;
  }
}
