import type { SVGProps } from "react";

/** 依存ライブラリを増やさないため、必要なアイコンだけを SVG で定義する */
type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
} as const;

export function ChatIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M21 12a8 8 0 0 1-8 8H8l-4 3v-5.2A8 8 0 0 1 13 4a8 8 0 0 1 8 8Z" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 11l5.6-1.9L12 3.5Z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
    </svg>
  );
}

export function FlagIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M5 21V4.5" />
      <path d="M5 5h11.5l-1.8 3.5L16.5 12H5" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9Z" />
      <path d="M10.5 19a1.8 1.8 0 0 0 3 0" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 8.5v4.5M12 16.5h.01" />
      <circle cx="12" cy="12" r="8.5" />
    </svg>
  );
}
