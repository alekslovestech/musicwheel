import React from "react";
import { NoteIndices } from "@/types/IndexTypes";
import { CircularVisMode } from "@/types/SettingModes";
import { PolarMath } from "@/utils/Keyboard/Circular/PolarMath";
import { NoteIndexVisualizer } from "@/utils/Keyboard/Circular/NoteIndexVisualizer";

const DOT_RADIUS = 6;
export class CircularVisualizations {
  static draw(
    selectedNoteIndices: NoteIndices,
    circularVisMode: CircularVisMode,
    innerRadius: number,
    color: string
  ): JSX.Element[] {
    if (selectedNoteIndices.length <= 1) return [];

    const visualizer = new NoteIndexVisualizer(innerRadius);

    const baseNoteDot = this.drawBaseNoteDot(selectedNoteIndices, innerRadius);
    const polyPoints = visualizer.getVisualization(
      selectedNoteIndices,
      circularVisMode
    );

    return [
      <polygon
        className={`selected-notes-polygon fill-none`}
        key="circularVis"
        stroke={color} //tailwind has issues with arbitrary colors, so we use SVG attributes
        strokeWidth={4}
        points={polyPoints.map((p) => `${p.x},${p.y}`).join(" ")}
      />,
      baseNoteDot,
    ];
  }

  private static drawBaseNoteDot(
    selectedNoteIndices: NoteIndices,
    innerRadius: number
  ): JSX.Element {
    const baseIndex = selectedNoteIndices[0];
    const middleAngle = PolarMath.NoteIndexToMiddleAngle(baseIndex);
    const innerPoint = PolarMath.getCartesianFromPolar(
      innerRadius,
      middleAngle,
      true
    );
    return (
      <circle
        className={`base-note-dot fill-keys-bgRootNote`}
        key="base-note"
        cx={innerPoint.x}
        cy={innerPoint.y}
        r={DOT_RADIUS}
      />
    );
  }
}
