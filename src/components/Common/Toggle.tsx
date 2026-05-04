import React from "react";

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const Toggle: React.FC<ToggleProps> = ({ id, checked, onChange, label }) => {
  const paddingClass = `gap-tight`;

  const checkboxStyles = [
    // Base styles
    "w-4 h-4 rounded border transition-colors duration-200",
    // Using unified color system
    "border-containers-border",
    "bg-buttons-bgDefault",
    // Checked state
    checked ? "bg-buttons-bgSelected border-buttons-borderSelected" : "",
    // Hover state
    !checked ? "hover:bg-buttons-bgHover" : "",
    // Focus state
    "focus:ring-2 focus:ring-buttons-bgSelected focus:ring-opacity-50",
    "cursor-pointer",
  ].join(" ");

  const labelStyles = [
    "text-sm text-labels-textDefault font-medium transition-colors duration-200",
    "hover:text-buttons-textSelected cursor-pointer",
  ].join(" ");

  return (
    <div className={`flex items-center ${paddingClass}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`${checkboxStyles} mr-tight`}
      />
      <label htmlFor={id} className={labelStyles}>
        {label}
      </label>
    </div>
  );
};
