import { motion } from "framer-motion"

interface XpRingProps {
  progress: number
  level: number
  xp: number
  levelXp: number
  accentColor: string
}

export function XpRing({ progress, level, xp, levelXp, accentColor }: XpRingProps) {
  const size = 140
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(1 0 0 / 8%)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${accentColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{level}</span>
          <span className="text-xs text-muted-foreground">Level</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold">{xp.toLocaleString()} XP</div>
        <div className="text-xs text-muted-foreground">
          {levelXp - (xp % levelXp)} XP to Level {level + 1}
        </div>
      </div>
    </div>
  )
}
