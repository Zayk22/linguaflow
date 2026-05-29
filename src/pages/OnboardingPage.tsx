import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useAppStore, type Language, type SkillLevel, type LearningGoal, type DailyGoal } from "@/store/useAppStore"
import { LANGUAGES } from "@/data/languages"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"

const SKILL_LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Starting from scratch",
    icon: "🌱",
    detail: "No prior experience needed",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Know the basics",
    icon: "📚",
    detail: "Can handle simple conversations",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Already proficient",
    icon: "🎯",
    detail: "Looking to master fluency",
  },
]

const LEARNING_GOALS = [
  { id: "travel", label: "Travel", icon: "✈️", description: "Navigate with confidence" },
  { id: "career", label: "Career", icon: "💼", description: "Professional advancement" },
  { id: "conversation", label: "Conversation", icon: "💬", description: "Connect with people" },
  { id: "anime", label: "Anime & Media", icon: "🎌", description: "Enjoy content natively" },
  { id: "culture", label: "Culture", icon: "🏛️", description: "Explore heritage" },
]

const DAILY_GOALS = [
  { value: 5, label: "5 min", description: "Casual", color: "text-blue-400" },
  { value: 10, label: "10 min", description: "Regular", color: "text-green-400" },
  { value: 20, label: "20 min", description: "Serious", color: "text-amber-400" },
  { value: 30, label: "30 min", description: "Intensive", color: "text-orange-400" },
]

const TOTAL_STEPS = 4

export function OnboardingPage() {
  const {
    onboardingStep,
    setOnboardingStep,
    activeLanguage,
    setActiveLanguage,
    addLanguage,
    setView,
  } = useAppStore()

  const [selectedSkill, setSelectedSkill] = useState<SkillLevel | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null)
  const [selectedDaily, setSelectedDaily] = useState<DailyGoal | null>(null)

  const step = onboardingStep
  const isAddingNewLanguage = step > 0 && step <= 3
  const stepsToShow = isAddingNewLanguage ? 3 : TOTAL_STEPS

  const canProceed = () => {
    if (step === 0) return !!activeLanguage
    if (step === 1) return !!selectedSkill
    if (step === 2) return !!selectedGoal
    if (step === 3) return !!selectedDaily
    return false
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setOnboardingStep(step + 1)
    } else {
      if (activeLanguage && selectedSkill && selectedGoal && selectedDaily) {
        addLanguage(activeLanguage, selectedSkill, selectedGoal, selectedDaily)
        setView("dashboard")
      }
    }
  }

  const handleBack = () => {
    if (step > 1 || (step > 0 && !isAddingNewLanguage)) {
      setOnboardingStep(step - 1)
    } else if (step === 1 && isAddingNewLanguage) {
      setView("languages")
    } else {
      setView("landing")
    }
  }

  const selectedLang = LANGUAGES.find((l) => l.id === activeLanguage)

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic ambient glow based on selected language */}
      <motion.div
        className="pointer-events-none fixed inset-0"
        animate={{
          background: selectedLang
            ? `radial-gradient(ellipse 80% 60% at 50% -10%, ${selectedLang.glowColor}, transparent)`
            : "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.5 0 0 / 15%), transparent)",
        }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              {step === 0 ? "Home" : step === 1 && isAddingNewLanguage ? "Languages" : "Back"}
            </button>
            <span className="text-xs text-muted-foreground font-medium">
              {isAddingNewLanguage ? step : step + 1} / {stepsToShow}
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-border/40 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: selectedLang ? selectedLang.accentColor : "oklch(0.7 0 0)",
              }}
              animate={{ width: `${((isAddingNewLanguage ? step : step + 1) / stepsToShow) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepLanguage
              key="lang"
              selected={activeLanguage}
              onSelect={(l) => setActiveLanguage(l as Language)}
            />
          )}
          {step === 1 && (
            <StepSkill
              key="skill"
              selected={selectedSkill}
              onSelect={setSelectedSkill}
              lang={selectedLang}
            />
          )}
          {step === 2 && (
            <StepGoal
              key="goal"
              selected={selectedGoal}
              onSelect={setSelectedGoal}
              lang={selectedLang}
            />
          )}
          {step === 3 && (
            <StepDaily
              key="daily"
              selected={selectedDaily}
              onSelect={setSelectedDaily}
              lang={selectedLang}
            />
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full h-12 font-semibold gap-2 text-base transition-all"
            style={
              canProceed() && selectedLang
                ? { background: selectedLang.accentColor, color: "#fff" }
                : {}
            }
          >
            {step === TOTAL_STEPS - 1 ? "Start Learning" : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

// Step 1 – Language
function StepLanguage({
  selected,
  onSelect,
}: {
  selected: Language | null
  onSelect: (l: Language) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Which language?</h2>
        <p className="mt-2 text-muted-foreground">Choose your learning destination</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {LANGUAGES.map((lang, i) => {
          const isSelected = selected === lang.id
          return (
            <motion.button
              key={lang.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(lang.id as Language)}
              className="relative rounded-2xl border p-6 text-left transition-all"
              style={{
                borderColor: isSelected ? lang.accentColor : "oklch(1 0 0 / 10%)",
                background: isSelected
                  ? `${lang.glowColor}`
                  : "oklch(1 0 0 / 4%)",
                boxShadow: isSelected ? `0 0 30px ${lang.glowColor}` : "none",
              }}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 size-5 rounded-full flex items-center justify-center"
                  style={{ background: lang.accentColor }}
                >
                  <Check className="size-3 text-white" />
                </motion.div>
              )}
              <span className="text-5xl mb-3 block">{lang.flag}</span>
              <div
                className="text-lg font-bold mb-1"
                style={{ color: isSelected ? lang.accentColor : undefined }}
              >
                {lang.name}
              </div>
              <div className="text-sm text-muted-foreground">{lang.nativeName}</div>
              <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {lang.tagline}
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// Step 2 – Skill Level
function StepSkill({
  selected,
  onSelect,
  lang,
}: {
  selected: SkillLevel | null
  onSelect: (s: SkillLevel) => void
  lang: (typeof LANGUAGES)[0] | undefined
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Your level?</h2>
        <p className="mt-2 text-muted-foreground">
          We'll tailor your path accordingly
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {SKILL_LEVELS.map((level, i) => {
          const isSelected = selected === level.id
          const accentColor = lang?.accentColor ?? "oklch(0.7 0 0)"
          const glowColor = lang?.glowColor ?? "oklch(0.5 0 0 / 20%)"
          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(level.id as SkillLevel)}
              className="flex items-center gap-5 rounded-2xl border p-5 text-left transition-all"
              style={{
                borderColor: isSelected ? accentColor : "oklch(1 0 0 / 10%)",
                background: isSelected ? glowColor : "oklch(1 0 0 / 4%)",
              }}
            >
              <span className="text-3xl">{level.icon}</span>
              <div className="flex-1">
                <div
                  className="font-semibold"
                  style={{ color: isSelected ? accentColor : undefined }}
                >
                  {level.label}
                </div>
                <div className="text-sm text-muted-foreground">{level.description}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{level.detail}</div>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="size-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: accentColor }}
                >
                  <Check className="size-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// Step 3 – Learning Goal
function StepGoal({
  selected,
  onSelect,
  lang,
}: {
  selected: LearningGoal | null
  onSelect: (g: LearningGoal) => void
  lang: (typeof LANGUAGES)[0] | undefined
}) {
  const accentColor = lang?.accentColor ?? "oklch(0.7 0 0)"
  const glowColor = lang?.glowColor ?? "oklch(0.5 0 0 / 20%)"

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Why are you learning?</h2>
        <p className="mt-2 text-muted-foreground">This helps us personalize your content</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_GOALS.map((goal, i) => {
          const isSelected = selected === goal.id
          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(goal.id as LearningGoal)}
              className="relative rounded-2xl border p-5 text-left transition-all"
              style={{
                borderColor: isSelected ? accentColor : "oklch(1 0 0 / 10%)",
                background: isSelected ? glowColor : "oklch(1 0 0 / 4%)",
              }}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 size-5 rounded-full flex items-center justify-center"
                  style={{ background: accentColor }}
                >
                  <Check className="size-3 text-white" />
                </motion.div>
              )}
              <span className="text-3xl mb-2 block">{goal.icon}</span>
              <div
                className="font-semibold text-sm"
                style={{ color: isSelected ? accentColor : undefined }}
              >
                {goal.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{goal.description}</div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// Step 4 – Daily Goal
function StepDaily({
  selected,
  onSelect,
  lang,
}: {
  selected: DailyGoal | null
  onSelect: (d: DailyGoal) => void
  lang: (typeof LANGUAGES)[0] | undefined
}) {
  const accentColor = lang?.accentColor ?? "oklch(0.7 0 0)"
  const glowColor = lang?.glowColor ?? "oklch(0.5 0 0 / 20%)"

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Daily goal</h2>
        <p className="mt-2 text-muted-foreground">
          Consistency beats intensity. Start small, stay consistent.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DAILY_GOALS.map((goal, i) => {
          const isSelected = selected === goal.value
          return (
            <motion.button
              key={goal.value}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(goal.value as DailyGoal)}
              className="relative rounded-2xl border p-6 text-center transition-all"
              style={{
                borderColor: isSelected ? accentColor : "oklch(1 0 0 / 10%)",
                background: isSelected ? glowColor : "oklch(1 0 0 / 4%)",
              }}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 size-5 rounded-full flex items-center justify-center"
                  style={{ background: accentColor }}
                >
                  <Check className="size-3 text-white" />
                </motion.div>
              )}
              <div
                className="text-3xl font-bold"
                style={{ color: isSelected ? accentColor : undefined }}
              >
                {goal.label}
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{ color: isSelected ? accentColor : undefined }}
              >
                {goal.description}
              </div>
              <div className="text-xs text-muted-foreground mt-1">per day</div>
            </motion.button>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 rounded-2xl border border-border/30 p-4 text-center"
        style={{ background: "oklch(1 0 0 / 3%)" }}
      >
        <p className="text-sm text-muted-foreground">
          🔥 Learners who set daily goals are <span className="text-foreground font-medium">3x more likely</span> to reach fluency
        </p>
      </motion.div>
    </motion.div>
  )
}
