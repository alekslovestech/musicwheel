import { InputMode } from "@/types/enums/InputMode";
import { CircularVisMode } from "@/types/enums/SettingModes";
import { useDisplay } from "@/contexts/DisplayContext";
import { useChordPresets } from "@/contexts/ChordPresetContext";

import { CircularVisIcons } from "@/utils/Keyboard/Circular/CircularVisIcons";
import { Button } from "../Common/Button";

export const CircularVisModeButton: React.FC<{
  mode: CircularVisMode; //vis mode this button represents
  label: string;
}> = ({ mode, label }) => {
  const { circularVisMode, setCircularVisMode } = useDisplay(); //vis mode currently selected
  const { inputMode } = useChordPresets();
  const visIcons = new CircularVisIcons(12, 10);

  const isDisabled =
    (inputMode === InputMode.SingleNote &&
      (mode === CircularVisMode.Radial || mode === CircularVisMode.Polygon)) ||
    (inputMode === InputMode.IntervalPresets && mode === CircularVisMode.Polygon);

  const isSelected = circularVisMode === mode;
  return (
    <Button
      key={mode}
      id={`vis-button-${mode}`}
      size="sm"
      variant="vis"
      selected={isSelected}
      onClick={() => !isDisabled && setCircularVisMode(mode)}
      title={label}
      disabled={isDisabled}
    >
      <svg
        width={visIcons.circleDiameter}
        height={visIcons.circleDiameter}
        viewBox={`0 0 ${visIcons.circleDiameter} ${visIcons.circleDiameter}`}
      >
        {visIcons.render(mode)}
      </svg>
    </Button>
  );
};
