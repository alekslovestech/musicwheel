import React, { type JSX } from "react";
import { ActualIndex, ixActual, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { CircularVisMode } from "@/types/enums/SettingModes";
import { CartesianPoint } from "@/types/interfaces/CartesianPoint";
import { PolarMath } from "@/utils/Keyboard/Circular/PolarMath";
import { NoteIndexVisualizer } from "@/utils/Keyboard/Circular/NoteIndexVisualizer";
import { getStepSegmentsForScale } from "@/utils/visual/scaleRibbonUtils";

const DOT_RADIUS = 6;

export class CircularVisualizations {
  static draw(
    selectedNoteIndices: NoteIndices,
    circularVisMode: CircularVisMode,
    innerRadius: number,
    color: string,
  ): JSX.Element[] {
    if (selectedNoteIndices.length <= 1) return [];

    const visualizer = new NoteIndexVisualizer(innerRadius);
    const polyPoints = visualizer.getVisualization(selectedNoteIndices, circularVisMode);

    return [
      this.drawPolygon(polyPoints, color, "circularVis"),
      this.drawBaseNoteDot(selectedNoteIndices[0]!, innerRadius),
    ];
  }

  static drawScaleStepIntervals(musicalKey: MusicalKey, innerRadius: number): JSX.Element[] {
    const scaleNotes = musicalKey.scaleModeInfo.getAbsoluteScaleNotes(musicalKey.tonicIndex);
    const steps = getStepSegmentsForScale(musicalKey);

    return steps.map((step, index) =>
      this.drawSegment(
        ixActual(scaleNotes[index]!),
        ixActual(scaleNotes[(index + 1) % scaleNotes.length]!),
        innerRadius,
        step.color.css(),
        `scale-step-${index}`,
      ),
    );
  }

  private static drawSegment(
    fromIndex: ActualIndex,
    toIndex: ActualIndex,
    innerRadius: number,
    color: string,
    key: string,
  ): JSX.Element {
    const visualizer = new NoteIndexVisualizer(innerRadius);
    const points = visualizer.getVisualization([fromIndex, toIndex], CircularVisMode.Polygon);
    return this.drawPolygon(points, color, key);
  }

  private static drawPolygon(points: CartesianPoint[], color: string, key: string): JSX.Element {
    return (
      <polygon
        className="selected-notes-polygon fill-none"
        key={key}
        stroke={color}
        strokeWidth={4}
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
      />
    );
  }

  private static drawBaseNoteDot(
    baseIndex: ActualIndex,
    innerRadius: number,
  ): JSX.Element {
    const middleAngle = PolarMath.NoteIndexToMiddleAngle(baseIndex);
    const innerPoint = PolarMath.getCartesianFromPolar(innerRadius, middleAngle, true);
    return (
      <circle
        className="base-note-dot fill-keys-bgRootNote"
        key="circularVis-base-note"
        cx={innerPoint.x}
        cy={innerPoint.y}
        r={DOT_RADIUS}
      />
    );
  }
}
