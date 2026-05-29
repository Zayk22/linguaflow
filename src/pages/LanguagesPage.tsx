import { motion } from "framer-motion"
import { useAppStore, type Language } from "@/store/useAppStore"
import { LANGUAGES } from "@/data/languages"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Check, Zap, Flame, BookOpen } from "lucide-react"

export function LanguagesPage() {
  const { setView, activeLanguage, languagesProgress, setActiveLanguage, setOnboardingStep } = useAppStore()

  const addedLanguages = (Object.entries(languagesProgress) as [Language, typeof languagesProgress[Language]][])
    .filter(([, progress]) => progress.onboardingComplete)
    .map(([lang]) => lang)

  const handleAddLanguage = (lang: Language) => {
    setActiveLanguage(lang)
    setOnboardingStep(1)
    setView("onboarding")
  }

  const handleSelectLanguage = (lang: Language) => {
    setActiveLanguage(lang)
    setView("dashboard")
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-6 md:px-8 border-b border-border/30">
        <button
          onClick={() => setView("dashboard")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </button>
        <div className="flex-1" />
        <h1 className="text-xl font-bold">Manage Languages</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:px-8">
        {/* Active & Added Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Languages</h2>
            <p className="text-muted-foreground">
              Switch between languages and track progress independently
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {LANGUAGES.map((lang, i) => {
              const langId = lang.id as Language
              const isAdded = addedLanguages.includes(langId)
              const isActive = activeLanguage === langId
              const progress = languagesProgress[langId]

              if (!isAdded) return null

              return (
                <motion.button
                  key={lang.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSelectLanguage(langId)}
                  className="relative text-left rounded-2xl border border-border/30 p-6 transition-all hover:border-border/60 group cursor-pointer"
                  style={{
                    background: isActive
                      ? `color-mix(in oklch, ${lang.glowColor}, transparent)`
                      : "oklch(1 0 0 / 4%)",
                  }}
                >
                  {isActive && (
                    <div className="absolute top-3 right-3">
                      <Badge className="gap-1" style={{ background: lang.accentColor, color: "#fff" }}>
                        <Check className="size-3" />
                        Active
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-5xl">{lang.flag}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{lang.name}</h3>
                      <p className="text-sm text-muted-foreground">{lang.nativeName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg p-2" style={{ background: "oklch(1 0 0 / 8%)" }}>
                      <Zap className="size-4 mx-auto mb-1" style={{ color: lang.accentColor }} />
                      <div className="font-bold text-sm">{progress.xp.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: "oklch(1 0 0 / 8%)" }}>
                      <Flame className="size-4 mx-auto mb-1 text-orange-400" />
                      <div className="font-bold text-sm">{progress.streak}</div>
                      <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: "oklch(1 0 0 / 8%)" }}>
                      <BookOpen className="size-4 mx-auto mb-1 text-blue-400" />
                      <div className="font-bold text-sm">{Object.values(progress.lessonProgress).filter((p) => p.completed).length}</div>
                      <div className="text-xs text-muted-foreground">Done</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/20">
                    <p className="text-xs text-muted-foreground capitalize">
                      {progress.skillLevel} · Goal: {progress.dailyGoal}m
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Available Languages to Add */}
        {addedLanguages.length < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Start a New Language</h2>
              <p className="text-muted-foreground">Learn up to 3 languages simultaneously</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {LANGUAGES.map((lang, i) => {
                const langId = lang.id as Language
                const isAdded = addedLanguages.includes(langId)

                if (isAdded) return null

                return (
                  <motion.div
                    key={lang.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="rounded-2xl border border-dashed border-border/40 p-6 hover:border-border/60 transition-all"
                  >
                    <div className="flex flex-col items-center text-center mb-4">
                      <span className="text-5xl mb-2">{lang.flag}</span>
                      <h3 className="font-bold text-lg">{lang.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{lang.tagline}</p>
                    </div>

                    <Button
                      onClick={() => handleAddLanguage(lang.id as Language)}
                      className="w-full gap-2 font-semibold"
                      style={{ background: lang.accentColor, color: "#fff" }}
                    >
                      <Plus className="size-4" />
                      Start Learning
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {addedLanguages.length === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border/30 p-6 text-center"
            style={{ background: "oklch(1 0 0 / 4%)" }}
          >
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-bold text-lg">You're learning all 3 languages!</p>
            <p className="text-muted-foreground mt-1">Master these and unlock new ones later</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
