import { useMemo } from "react"

interface ActivityHeatmapProps {
  accentColor: string
}

export function ActivityHeatmap({ accentColor }: ActivityHeatmapProps) {
  const weeks = 15
  const days = 7

  const data = useMemo(() => {
    return Array.from({ length: weeks }, (_, w) =>
      Array.from({ length: days }, () => {
        const rand = Math.random()
        // More recent weeks are more active
        const weight = 0.3 + (w / weeks) * 0.7
        if (rand < 0.35 * weight) return 0
        if (rand < 0.55 * weight) return 1
        if (rand < 0.75 * weight) return 2
        if (rand < 0.9 * weight) return 3
        return 4
      })
    )
  }, [])

  const getColor = (level: number) => {
    if (level === 0) return "oklch(1 0 0 / 6%)"
    const opacities = [0, 0.25, 0.45, 0.65, 0.9]
    return `color-mix(in oklch, ${accentColor} ${opacities[level] * 100}%, transparent)`
  }

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-0">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          <div className="h-2 w-3" />
          {dayLabels.map((d, i) => (
            <div key={i} className="h-2.5 w-3 text-[9px] text-muted-foreground flex items-center">
              {i % 2 === 0 ? d : ""}
            </div>
          ))}
        </div>

        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            <div className="h-2" />
            {week.map((level, di) => (
              <div
                key={di}
                title={`${level * 10} XP`}
                className="size-2.5 rounded-sm transition-all hover:scale-125 cursor-pointer"
                style={{ background: getColor(level) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-muted-foreground">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="size-2.5 rounded-sm"
            style={{ background: getColor(level) }}
          />
        ))}
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  )
}
