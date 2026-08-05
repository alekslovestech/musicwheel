import React, { type JSX } from "react";
import { ActualIndex, ixActual, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { CircularVisMode } from "@/types/enums/SettingModes";
import { CartesianPoint, toSvgPointsString } from "@/types/interfaces/CartesianPoint";
import { PolarMath } from "@/utils/Keyboard/Circular/PolarMath";
import { NoteIndexVisualizer } from "@/utils/Keyboard/Circular/NoteIndexVisualizer";
import { getStepSegmentsForScale } from "@/utils/visual/scaleRibbonUtils";

const DOT_RADIUS = 6;
const SCALE_DEGREE_DOT_RADIUS = 3;

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

    const segments = steps.map((step, index) =>
      this.drawSegment(
        ixActual(scaleNotes[index]!),
        ixActual(scaleNotes[(index + 1) % scaleNotes.length]!),
        innerRadius,
        step.color.css(),
        `scale-step-${index}`,
      ),
    );

    /** Drawn on top of the segments to smooth the seam where two differently-colored steps meet. */
    const degreeDots = scaleNotes.map((noteIndex, index) =>
      this.drawNoteDot(
        ixActual(noteIndex),
        innerRadius,
        "scale-degree-dot fill-keys-borderColor",
        `scale-degree-dot-${index}`,
        SCALE_DEGREE_DOT_RADIUS,
      ),
    );

    return [...segments, ...degreeDots];
  }

  private static drawSegment(
    fromIndex: ActualIndex,
    toIndex: ActualIndex,
    innerRadius: number,
    color: string,
    key: string,
  ): JSX.Element {
    const visualizer = new NoteIndexVisualizer(innerRadius);
    const [from, to] = visualizer.getVisualization([fromIndex, toIndex], CircularVisMode.Polygon);
    return (
      <line
        className="scale-step-segment"
        key={key}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        x1={from!.x}
        y1={from!.y}
        x2={to!.x}
        y2={to!.y}
      />
    );
  }

  private static drawPolygon(points: CartesianPoint[], color: string, key: string): JSX.Element {
    return (
      <polygon
        className="selected-notes-polygon fill-none"
        key={key}
        stroke={color}
        strokeWidth={4}
        points={toSvgPointsString(points)}
      />
    );
  }

  private static drawBaseNoteDot(baseIndex: ActualIndex, innerRadius: number): JSX.Element {
    return this.drawNoteDot(
      baseIndex,
      innerRadius,
      "base-note-dot fill-keys-bgRootNote",
      "circularVis-base-note",
    );
  }

  private static drawNoteDot(
    index: ActualIndex,
    innerRadius: number,
    className: string,
    key: string,
    radius: number = DOT_RADIUS,
  ): JSX.Element {
    const middleAngle = PolarMath.NoteIndexToMiddleAngle(index);
    const point = PolarMath.getCartesianFromPolar(innerRadius, middleAngle, true);
    return <circle className={className} key={key} cx={point.x} cy={point.y} r={radius} />;
  }
}
