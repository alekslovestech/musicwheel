/** 16 columns per 4/4 bar at sixteenth-note grid resolution. */
export const COLUMNS_PER_BAR = 16;

export type FormattedBarToken = {
  label: string;
  /** Number of 16th-note columns to span (4/4 bar = 16 columns). */
  colSpan: number;
};

export type BarRow = FormattedBarToken[];
