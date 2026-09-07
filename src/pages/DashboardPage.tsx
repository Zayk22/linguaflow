import { motion } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { getLanguageConfig, getLearningPath } from "@/data/languages"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Flame, Zap, Trophy, BookOpen, Target, TrendingUp,
  LogOut, Settings, BarChart2, Map, Star, Lock, ChevronRight,
  Clock, Calendar, RefreshCw
} from "lucide-react"
import { XpRing } from "@/components/dashboard/XpRing"
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap"
import { MobileNav } from "@/components/dashboard/MobileNav"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

const STAGGER = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
}

export function DashboardPage() {
  const { user, activeLanguage, logout, setView, setActiveLessonId, getActiveLanguageProgress, getDueReviewItems } = useAppStore()

  const langProgress = getActiveLanguageProgress()
  if (!langProgress || !activeLanguage) {
    return <div className="flex items-center justify-center min-h-screen">No active language</div>
  }

  const langConfig = getLanguageConfig(activeLanguage)
  const path = getLearningPath(activeLanguage, langProgress.skillLevel)
  const firstUnit = path[0]
  const firstLesson = firstUnit?.lessons.find((l) => !l.locked && !langProgress.lessonProgress[l.id]?.completed)

  const completedCount = Object.values(langProgress.lessonProgress).filter((p) => p.completed).length
  const { xp: totalXp, streak, dailyGoal } = langProgress
  const levelXp = 1000
  const levelProgress = (totalXp % levelXp) / levelXp * 100
  const userLevel = Math.floor(totalXp / levelXp) + 1
  const dueReviewCount = getDueReviewItems(activeLanguage).length

  const accentColor = langConfig?.accentColor ?? "oklch(0.65 0.22 38)"
  const glowColor = langConfig?.glowColor ?? "oklch(0.65 0.22 38 / 30%)"

  return (
    <div className={`min-h-screen bg-background ${langConfig?.themeClass ?? ""}`}>
      {/* Ambient top glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(ellipse 100% 40% at 50% -10%, ${glowColor}, transparent)`,
        }}
      />

      <div className="relative flex min-h-screen">
        {/* Sidebar – desktop */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border/30 bg-sidebar/50 backdrop-blur-xl p-4">
          <div className="flex items-center gap-2 px-2 py-3 mb-6">
            <div
              className="size-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
              style={{ background: accentColor }}
            >
              L
            </div>
            <span className="font-bold text-lg">LinguaFlow</span>
          </div>

          <nav className="space-y-1 flex-1">
            {[
              { icon: BarChart2, label: "Dashboard", active: true },
              { icon: Map, label: "Learning Path", action: () => setView("path") },
              { icon: BookOpen, label: "Lessons", action: () => setView("lesson") },
              { icon: RefreshCw, label: "Review", action: () => setView("review") },
              { icon: Trophy, label: "Achievements", action: () => setView("achievements") },
              { icon: Target, label: "Goals" },
              { icon: TrendingUp, label: "Progress" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  item.active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                style={item.active ? { background: `${glowColor}`, color: accentColor } : {}}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>

          <Separator className="my-4 bg-border/30" />

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
              <Settings className="size-4" />
              Settings
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive transition-all"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>

          {/* User card */}
          <div className="mt-4 rounded-2xl border border-border/30 p-4" style={{ background: "oklch(1 0 0 / 4%)" }}>
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: accentColor }}
              >
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{user?.name ?? "Guest"}</div>
                <div className="text-xs text-muted-foreground">Level {userLevel}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-8">
          <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 md:py-8">

            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                <h1 className="text-2xl font-bold tracking-tight mt-0.5">
                  Welcome back, {user?.name?.split(" ")[0] ?? "Learner"} {langConfig?.flag}
                </h1>
              </motion.div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <div className="flex items-center gap-1.5 rounded-xl px-3 py-2 glass text-sm font-semibold">
                  <Flame className="size-4 text-orange-400" />
                  <span>{streak}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl px-3 py-2 glass text-sm font-semibold">
                  <Zap className="size-4 text-yellow-400" />
                  <span>{totalXp.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <motion.div
              variants={STAGGER.container}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4"
            >
              {[
                { label: "Day Streak", value: streak, icon: Flame, color: "text-orange-400", bg: "oklch(0.65 0.22 60 / 15%)" },
                { label: "Total XP", value: totalXp.toLocaleString(), icon: Zap, color: "text-yellow-400", bg: "oklch(0.85 0.18 90 / 15%)" },
                { label: "Lessons Done", value: completedCount, icon: BookOpen, color: "text-blue-400", bg: "oklch(0.6 0.18 240 / 15%)" },
                { label: "Daily Goal", value: `${dailyGoal ?? 10}m`, icon: Target, color: "text-green-400", bg: "oklch(0.6 0.18 140 / 15%)" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={STAGGER.item}
                  className="rounded-2xl border border-border/30 p-4 flex items-center gap-3"
                  style={{ background: stat.bg }}
                >
                  <stat.icon className={`size-5 shrink-0 ${stat.color}`} />
                  <div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className="font-bold text-lg leading-tight">{stat.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Review due card */}
            {dueReviewCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border p-4 mb-6 flex items-center justify-between"
                style={{
                  borderColor: `${accentColor}50`,
                  background: `color-mix(in oklch, ${accentColor} 10%, transparent)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="size-5" style={{ color: accentColor }} />
                  <div>
                    <div className="font-semibold">{dueReviewCount} items due for review</div>
                    <div className="text-xs text-muted-foreground">Strengthen your memory with spaced repetition</div>
                  </div>
                </div>
                <Button
                  onClick={() => setView("review")}
                  size="sm"
                  className="gap-2 font-semibold"
                  style={{ background: accentColor, color: "#fff" }}
                >
                  Review Now
                  <ChevronRight className="size-4" />
                </Button>
              </motion.div>
            )}

            {/* XP Level progress + Continue card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5"
            >
              {/* XP Ring */}
              <div
                className="rounded-2xl border border-border/30 p-5 flex flex-col items-center justify-center md:col-span-2"
                style={{ background: "oklch(1 0 0 / 4%)" }}
              >
                <XpRing
                  progress={levelProgress}
                  level={userLevel}
                  xp={totalXp}
                  levelXp={levelXp}
                  accentColor={accentColor}
                />
              </div>

              {/* Continue learning */}
              <div
                className="rounded-2xl border border-border/30 p-5 flex flex-col md:col-span-3"
                style={{ background: "oklch(1 0 0 / 4%)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Continue Learning
                  </h3>
                  <Badge variant="secondary" className="text-xs" style={{ color: accentColor }}>
                    {langConfig?.name}
                  </Badge>
                </div>

                {firstLesson ? (
                  <>
                    <div className="flex-1">
                      <div className="text-2xl mb-2">{firstLesson.icon}</div>
                      <h4 className="font-bold text-lg">{firstLesson.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{firstLesson.subtitle}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {firstLesson.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="size-3" />
                          +{firstLesson.xp} XP
                        </span>
                      </div>
                    </div>
                    <Button
                      className="mt-4 w-full gap-2 font-semibold"
                      style={{ background: accentColor, color: "#fff" }}
                      onClick={() => {
                        setActiveLessonId(firstLesson.id)
                        setView("lesson")
                      }}
                    >
                      Start Lesson
                      <ChevronRight className="size-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <Trophy className="size-8 mx-auto mb-2 text-yellow-400" />
                      <p className="font-medium">All caught up!</p>
                      <p className="text-sm text-muted-foreground">Check back tomorrow for new lessons</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Daily progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border/30 p-5 mb-6"
              style={{ background: "oklch(1 0 0 / 4%)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Daily Goal</h3>
                <span className="text-sm text-muted-foreground">
                  <Calendar className="size-3.5 inline mr-1" />
                  Today
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>0 / {dailyGoal ?? 10} min</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div
                  className="size-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: accentColor }}
                >
                  {dailyGoal ?? 10}m
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Complete a lesson to start building your streak!</p>
            </motion.div>

            {/* Learning path preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-border/30 p-5 mb-6"
              style={{ background: "oklch(1 0 0 / 4%)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Learning Path</h3>
                <button
                  onClick={() => setView("path")}
                  className="text-xs font-medium flex items-center gap-1"
                  style={{ color: accentColor }}
                >
                  View all
                  <ChevronRight className="size-3" />
                </button>
              </div>

              {firstUnit && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="size-2 rounded-full"
                      style={{ background: accentColor }}
                    />
                    <span className="text-sm font-medium">{firstUnit.title}</span>
                    <span className="text-xs text-muted-foreground">— {firstUnit.description}</span>
                  </div>
                  <div className="space-y-2">
                    {firstUnit.lessons.slice(0, 4).map((lesson) => {
                      const done = !!langProgress.lessonProgress[lesson.id]?.completed
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 rounded-xl p-3 border border-border/20 transition-all"
                          style={{ background: done ? `${glowColor}` : "oklch(1 0 0 / 3%)" }}
                        >
                          <span className="text-lg">{lesson.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{lesson.title}</div>
                            <div className="text-xs text-muted-foreground">{lesson.subtitle}</div>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {lesson.locked ? (
                              <Lock className="size-3.5 text-muted-foreground" />
                            ) : done ? (
                              <Star
                                className="size-3.5"
                                style={{ color: accentColor }}
                                fill={accentColor}
                              />
                            ) : (
                              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                +{lesson.xp} XP
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Activity heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-border/30 p-5"
              style={{ background: "oklch(1 0 0 / 4%)" }}
            >
              <h3 className="font-semibold mb-4">Activity</h3>
              <ActivityHeatmap accentColor={accentColor} />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav
        accentColor={accentColor}
        onPath={() => setView("path")}
        onLesson={() => setView("lesson")}
      />
    </div>
  )
}