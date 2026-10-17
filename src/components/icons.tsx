import type { ReactNode } from "react";

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function HeartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        {...stroke}
        fill="currentColor"
        d="M12 19.4c-4.2-2.7-6.7-5.3-6.7-8.1C5.3 9 6.8 7.5 8.7 7.5c1.1 0 2 .5 2.7 1.4.6-.9 1.6-1.4 2.7-1.4 1.9 0 3.4 1.5 3.4 3.8 0 2.8-2.5 5.4-6.7 8.1h-.8z"
      />
    </Svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4" y="5.5" width="16" height="14" rx="2.5" {...stroke} />
      <path d="M8 3.8v3.2M16 3.8v3.2M4 9.5h16" {...stroke} />
    </Svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 20.5s6-5.1 6-9.3A6 6 0 0 0 6 11.2c0 4.2 6 9.3 6 9.3z" {...stroke} />
      <circle cx="12" cy="11" r="1.7" {...stroke} />
    </Svg>
  );
}

export function DressIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M9 5.5 7 8.2 9.2 10 8 19.5h8L14.8 10 17 8.2 15 5.5" {...stroke} />
      <path d="M9.5 5.5c.4 1.3 1.3 2 2.5 2s2.1-.7 2.5-2" {...stroke} />
    </Svg>
  );
}

export function CheersIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8 4.5 6.2 14a3.2 3.2 0 0 0 6.3 0L10.6 4.5" {...stroke} />
      <path d="M16 4.5l1.8 9.5a3.2 3.2 0 0 1-6.3 0" {...stroke} />
      <path d="M7 8.2h3.2M14.2 8.2H17" {...stroke} />
    </Svg>
  );
}

export function CakeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 12.5h12v6.2a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.7v-6.2z" {...stroke} />
      <path d="M6 15.2h12M12 12.5V9.2" {...stroke} />
      <path d="M12 7.2c.7-.8.7-1.6 0-2.4.7.8.7 1.6 0 2.4z" {...stroke} />
    </Svg>
  );
}

export function UtensilsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8 4.5v6.2M6.2 4.5v4.8c0 .8.8 1.4 1.8 1.4s1.8-.6 1.8-1.4V4.5" {...stroke} />
      <path d="M8 10.7V19.5M16.2 4.5c1.4 1.6 1.6 3.4.2 5.2L15 12.2V19.5" {...stroke} />
    </Svg>
  );
}

export function MusicIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M9.5 16.8V7.2l8-1.6v9.4" {...stroke} />
      <circle cx="7.8" cy="16.8" r="2.1" {...stroke} />
      <circle cx="15.5" cy="15" r="2.1" {...stroke} />
    </Svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8 6.5v11M16 6.5v11" {...stroke} />
    </Svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8 6.2v11.6l9-5.8-9-5.8z" {...stroke} />
    </Svg>
  );
}

export function SkipIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6.5 7.2v9.6L14 12 6.5 7.2zM16.2 7.2v9.6" {...stroke} />
    </Svg>
  );
}

export function ReplayIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 8.2A6.2 6.2 0 1 1 6.2 14" {...stroke} />
      <path d="M7 4.8v3.6H10.6" {...stroke} />
    </Svg>
  );
}
