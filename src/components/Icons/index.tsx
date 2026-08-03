
type IconProps = {
  className: string;
};

/**
 * Shared circular frame every playback icon draws its glyph inside. Size is fixed here, not
 * left to `className` - every real caller uses the same 8x8 frame, so `className` only ever
 * carries color.
 */
function IconBase({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-8 w-8 ${className}`}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      {children}
    </svg>
  );
}

export const PlayIcon: React.FC<IconProps> = ({ className }) => (
  <IconBase className={className}>
    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
  </IconBase>
);

export const PauseIcon: React.FC<IconProps> = ({ className }) => (
  <IconBase className={className}>
    <rect x="9" y="8" width="2" height="8" rx="0.5" fill="currentColor" />
    <rect x="13" y="8" width="2" height="8" rx="0.5" fill="currentColor" />
  </IconBase>
);

export const StopIcon: React.FC<IconProps> = ({ className }) => (
  <IconBase className={className}>
    <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor" />
  </IconBase>
);

export const ResumeIcon: React.FC<IconProps> = ({ className }) => (
  <IconBase className={className}>
    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
  </IconBase>
);

