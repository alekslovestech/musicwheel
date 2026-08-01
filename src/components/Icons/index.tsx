
type IconProps = {
  className?: string;
};

export const PlayIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <rect x="9" y="8" width="2" height="8" rx="0.5" fill="currentColor" />
    <rect x="13" y="8" width="2" height="8" rx="0.5" fill="currentColor" />
  </svg>
);

export const StopIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor" />
  </svg>
);

export const ResumeIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
  </svg>
);

