import React from "react";
import { TYPOGRAPHY } from "@/lib/design";

import {
  ButtonVariant,
  ButtonSize,
  BASE_STYLES,
  VARIANTS,
  SIZES,
  SELECTED_STYLES,
  DISABLED_STYLES,
} from "@/lib/design";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  selected?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "option",
  size = "md",
  selected = false,
  disabled = false,
  className = "",
  ...props
}) => {
  // Action buttons should never show selected state
  const shouldShowSelected = selected && variant !== "action";
  const selectedStyles = shouldShowSelected ? `${SELECTED_STYLES} selected` : "";
  const disabledStyles = disabled ? `${DISABLED_STYLES} disabled` : "";

  const propsId = props.id;
  const propsWithoutId = { ...props };
  delete propsWithoutId.id;

  return (
    <button
      id={propsId}
      disabled={disabled}
      className={`${BASE_STYLES} ${TYPOGRAPHY.buttonText} ${SIZES[size]} ${VARIANTS[variant]} ${selectedStyles} ${disabledStyles} ${className}`}
      {...propsWithoutId}
    >
      {children}
    </button>
  );
};
