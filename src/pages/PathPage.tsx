import { motion } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { getLanguageConfig, getLearningPath } from "@/data/languages"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lock, Star, Clock, Zap, ChevronRight, Check, BookOpen, Type, MessageSquare, Headphones, Mic, Hourglass } from "lucide-react"

// Helper: map lesson type to a Lucide icon
function getLessonIcon(type: string) {
  switch (type) {
    case "vocabulary": return <BookOpen className="size-5" />
    case "grammar": return <Type className="size-5" />
    case "conversation": return <MessageSquare className="size-5" />
    case "listening": return <Headphones className="size-5" />
    case "pronunciation": return <Mic className="size-5" />
    default: return <BookOpen className="size-5" />
  }
}

export function PathPage() {
  const { setView, activeLanguage, setActiveLessonId, getActiveLanguageProgress } = useAppStore()

  const langProgress = getActiveLanguageProgress()
  if (!langProgress || !activeLanguage) {
    return <div className="flex items-center justify-center min-h-screen">No active language</div>
  }

  const langConfig = getLanguageConfig(activeLanguage)
  const path = getLearningPath(activeLanguage, langProgress.skillLevel)
  const { lessonProgress } = langProgress

  const accentColor = langConfig?.accentColor ?? "oklch(0.65 0.22 38)"
  const glowColor = langConfig?.glowColor ?? "oklch(0.65 0.22 38 / 30%)"

  return (
    <div
      className="min-h-screen bg-background pb-24"
      style={{ background: `radial-gradient(ellipse 80% 30% at 50% -5%, ${glowColor}, oklch(0.08 0 0))` }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 px-4 py-4 md:px-8 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <button
          onClick={() => setView("dashboard")}
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-xl">{langConfig?.flag}</span>
          <span className="font-semibold">{langConfig?.name}</span>
          <Badge variant="secondary" className="text-xs capitalize">
            {langProgress.skillLevel}
          </Badge>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight">Learning Path</h1>
          <p className="text-muted-foreground mt-1">
            Your personalized {langConfig?.name} curriculum
          </p>
        </motion.div>

        {path.map((unit, unitIndex) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: unitIndex * 0.1 }}
            className="mb-8"
          >
            {/* Unit header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: accentColor }}
              >
                {unitIndex + 1}
              </div>
              <div>
                <h3 className="font-bold">{unit.title}</h3>
                <p className="text-sm text-muted-foreground">{unit.description}</p>
              </div>
            </div>

            {/* Lesson nodes */}
            <div className="relative pl-4">
              {/* Vertical line */}
              <div
                className="absolute left-4 top-0 bottom-0 w-0.5"
                style={{ background: `oklch(from ${accentColor} l c h / 20%)` }}
              />

              <div className="space-y-3">
                {unit.lessons.map((lesson, lessonIndex) => {
                  const done = !!lessonProgress[lesson.id]?.completed

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: unitIndex * 0.1 + lessonIndex * 0.05 }}
                      className="ml-8 relative"
                    >
                      {/* Node dot */}
                      <div
                        className="absolute -left-12 top-1/2 -translate-y-1/2 size-4 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: done || (!lesson.locked)
                            ? accentColor
                            : "oklch(1 0 0 / 20%)",
                          background: done
                            ? accentColor
                            : "oklch(0.08 0 0)",
                        }}
                      >
                        {done && <Check className="size-2 text-white" />}
                      </div>

                      <button
                        disabled={lesson.locked}
                        onClick={() => {
                          if (!lesson.locked) {
                            setActiveLessonId(lesson.id)
                            setView("lesson")
                          }
                        }}
                        className="w-full text-left rounded-2xl border border-border/20 p-4 transition-all hover:border-border/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: done
                            ? `color-mix(in oklch, ${accentColor} 10%, transparent)`
                            : "oklch(1 0 0 / 4%)",
                          borderColor: done ? `${accentColor}50` : undefined,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Replace emoji with Lucide icon */}
                          <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0" style={{ color: accentColor }}>
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{lesson.title}</span>
                              {done && (
                                <Star
                                  className="size-3.5"
                                  style={{ color: accentColor }}
                                  fill={accentColor}
                                />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{lesson.subtitle}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {lesson.duration} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="size-3" />
                                {lesson.xp} XP
                              </span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                                {lesson.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {lesson.locked ? (
                              <Lock className="size-4 text-muted-foreground" />
                            ) : done ? (
                              <div
                                className="size-7 rounded-full flex items-center justify-center"
                                style={{ background: accentColor }}
                              >
                                <Check className="size-3.5 text-white" />
                              </div>
                            ) : (
                              <div
                                className="size-7 rounded-full border-2 flex items-center justify-center transition-all"
                                style={{ borderColor: accentColor }}
                              >
                                <ChevronRight className="size-3.5" style={{ color: accentColor }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Coming soon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-dashed border-border/30 p-6 text-center"
        >
          <div className="flex justify-center mb-2">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center">
              <Hourglass className="size-5 text-muted-foreground" />
            </div>
          </div>
          <p className="font-medium">More units coming soon</p>
          <p className="text-sm text-muted-foreground mt-1">
            Complete all current lessons to unlock advanced content
          </p>
        </motion.div>
      </div>
    </div>
  )
}