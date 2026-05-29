import { useAppStore } from "@/store/useAppStore"
import { getLanguageConfig } from "@/data/languages"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Flame, Target, Zap, BookOpen, Lock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const ACHIEVEMENTS = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: BookOpen,
    xp: 20,
    requirement: (stats: { completed: number }) => stats.completed >= 1,
  },
  {
    id: "ten-lessons",
    title: "Dedicated Learner",
    description: "Complete 10 lessons",
    icon: BookOpen,
    xp: 50,
    requirement: (stats: { completed: number }) => stats.completed >= 10,
  },
  {
    id: "streak-7",
    title: "Weekly Warrior",
    description: "Reach a 7-day streak",
    icon: Flame,
    xp: 100,
    requirement: (stats: { streak: number }) => stats.streak >= 7,
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Reach a 30-day streak",
    icon: Flame,
    xp: 250,
    requirement: (stats: { streak: number }) => stats.streak >= 30,
  },
  {
    id: "xp-500",
    title: "XP Novice",
    description: "Earn 500 total XP",
    icon: Zap,
    xp: 50,
    requirement: (stats: { xp: number }) => stats.xp >= 500,
  },
  {
    id: "xp-2000",
    title: "XP Collector",
    description: "Earn 2000 total XP",
    icon: Zap,
    xp: 100,
    requirement: (stats: { xp: number }) => stats.xp >= 2000,
  },
  {
    id: "accuracy-100",
    title: "Perfect Accuracy",
    description: "Complete a lesson with 100% accuracy",
    icon: Target,
    xp: 30,
    requirement: (stats: { completed: number }) => stats.completed >= 1,
  },
  {
    id: "all-languages",
    title: "Polyglot",
    description: "Start learning all 3 languages",
    icon: Trophy,
    xp: 200,
    requirement: (stats: { languages: number }) => stats.languages >= 3,
  },
]

export function AchievementsPage() {
  const { user, activeLanguage, getActiveLanguageProgress, setView } = useAppStore()

  if (!user || !activeLanguage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please complete onboarding first.</p>
      </div>
    )
  }

  const langProgress = getActiveLanguageProgress()
  const langConfig = getLanguageConfig(activeLanguage)
  const accentColor = langConfig?.accentColor ?? "oklch(0.65 0.22 38)"

  // Compute stats from the active language's progress
  const completedCount = langProgress
    ? Object.values(langProgress.lessonProgress).filter((p) => p.completed).length
    : 0
  const stats = {
    completed: completedCount,
    streak: langProgress?.streak ?? 0,
    xp: langProgress?.xp ?? 0,
    languages: 1, // You could enhance this by counting languages with any progress
  }

  const achievements = ACHIEVEMENTS.map((ach) => ({
    ...ach,
    earned: ach.requirement(stats),
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => setView("dashboard")}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Achievements</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach, index) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border p-5 ${
                ach.earned
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/30 bg-card opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`size-12 rounded-xl flex items-center justify-center text-2xl ${
                    ach.earned ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  {ach.earned ? (
                    <ach.icon className="size-6" style={{ color: accentColor }} />
                  ) : (
                    <Lock className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{ach.title}</h3>
                    {ach.earned && (
                      <CheckCircle className="size-4" style={{ color: accentColor }} />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{ach.description}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    +{ach.xp} XP
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}