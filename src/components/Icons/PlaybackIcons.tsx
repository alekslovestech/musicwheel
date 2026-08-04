
/**
 * Shared circular frame every playback icon draws its glyph inside. Size and color are fixed
 * here rather than left to a prop - every real caller wants the same 8x8 frame in the same
 * playback color, so a configurable className would just be unused generality.
 */
function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-playback">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      {children}
    </svg>
  );
}

export const PlayIcon: React.FC = () => (
  <IconBase>
    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
  </IconBase>
);

export const PauseIcon: React.FC = () => (
  <IconBase>
    <rect x="9" y="8" width="2" height="8" rx="0.5" fill="currentColor" />
    <rect x="13" y="8" width="2" height="8" rx="0.5" fill="currentColor" />
  </IconBase>
);

export const StopIcon: React.FC = () => (
  <IconBase>
    <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor" />
  </IconBase>
);

export const ResumeIcon: React.FC = () => (
  <IconBase>
    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
  </IconBase>
);

