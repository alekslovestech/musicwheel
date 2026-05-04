export type ButtonVariant = "option" | "action" | "global" | "vis";
export type ButtonSize = "sm" | "md" | "lg";

export const BASE_STYLES =
  "rounded-2xl border border-buttons-border bg-buttons-bgDefault text-buttons-textDefault hover:bg-buttons-bgHover shadow-sm hover:shadow active:shadow-sm transition-all duration-150";

export const VARIANTS: Record<ButtonVariant, string> = {
  option: "",
  action:
    "max-w-24 text-default self-center bg-buttons-actionBgDefault border-buttons-actionBorder text-buttons-actionText hover:bg-buttons-actionBgHover active:bg-buttons-actionBgActive shadow-md hover:shadow-lg active:shadow-sm transform hover:scale-105 active:scale-95", // More dynamic styling
  global:
    "!bg-buttons-bgSelected/20 !border-buttons-bgSelected/40 !text-buttons-bgSelected hover:!bg-buttons-bgSelected/30 hover:!border-buttons-bgSelected/60 whitespace-normal shadow-md hover:shadow-lg font-medium !rounded-full px-3 py-1 text-sm transition-all duration-200 transform hover:scale-105 !min-w-0 !max-w-none", // Using same blue family with opacity
  vis: "rounded-none border-buttons-border fill-none stroke-[2px] stroke-black text-buttons-textDefault text-font-bold",
};

export const SIZES: Record<ButtonSize, string> = {
  sm: "px-tight py-tight min-w-button-sm max-w-button-sm",
  md: "px-snug py-snug min-w-button-md max-w-button-md",
  lg: "px-normal py-normal min-w-button-lg max-w-button-lg",
};

export const SELECTED_STYLES =
  "!bg-buttons-bgSelected !border-buttons-borderSelected !text-buttons-textSelected fill-none stroke-[3px] stroke-white pointer-events-none shadow-inner"; // Added shadow-inner for "pressed in" look

export const DISABLED_STYLES = "opacity-50 cursor-not-allowed bg-buttons-bgDisabled !shadow-none";
