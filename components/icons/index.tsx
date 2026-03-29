import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 20, ...props }: IconProps) {
  return { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...props }
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

export function TimerIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2" />
      <path d="M5 3L2 6" />
      <path d="M22 6l-3-3" />
      <path d="M12 2v2" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l6.58-6.58a1 1 0 0 0 0-1.42L12 2z" />
      <path d="M7 7h.01" />
    </svg>
  )
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  )
}

export function ExportIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export function EditIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

export function LibraryIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  )
}

export function PenIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  )
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

export function RulerIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0z" />
      <path d="M14.5 12.5l2-2" />
      <path d="M11.5 9.5l2-2" />
      <path d="M8.5 6.5l2-2" />
      <path d="M17.5 15.5l2-2" />
    </svg>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...Icon(props)}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
