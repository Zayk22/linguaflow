import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { getLanguageConfig } from "@/data/languages"
import { speakText } from "@/lib/speech"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Zap, CheckCircle2, Volume2 } from "lucide-react"

export function ReviewPage() {
  const { activeLanguage, setView, getDueReviewItems, reviewItem } = useAppStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  if (!activeLanguage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No active language
      </div>
    )
  }

  const dueItems = getDueReviewItems(activeLanguage)
  const langConfig = getLanguageConfig(activeLanguage)
  const accentColor = langConfig?.accentColor ?? "oklch(0.65 0.22 38)"
  const glowColor = langConfig?.glowColor ?? "oklch(0.65 0.22 38 / 30%)"

  if (dueItems.length === 0 || currentIndex >= dueItems.length) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: `radial-gradient(ellipse 80% 40% at 50% -10%, ${glowColor}, transparent)` }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="size-16" style={{ color: accentColor }} />
          </div>
          <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
          <p className="text-muted-foreground mb-6">
            You have no reviews due right now. Come back later to strengthen your memory.
          </p>
          <Button
            onClick={() => setView("dashboard")}
            className="gap-2 font-semibold px-6"
            style={{ background: accentColor, color: "#fff" }}
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    )
  }

  const item = dueItems[currentIndex]
  const progress = ((currentIndex) / dueItems.length) * 100

  const handleRate = (quality: 0 | 3 | 5) => {
    reviewItem(activeLanguage, item.id, quality)
    setRevealed(false)
    setCurrentIndex((i) => i + 1)
  }

  const speakAnswer = () => {
    if (item?.answer) {
      const langCode = activeLanguage === "spanish" ? "es-ES" : activeLanguage === "japanese" ? "ja-JP" : "tr-TR"
      speakText(item.answer, langCode)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${glowColor}, transparent), oklch(0.08 0 0)` }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 md:px-8">
        <button
          onClick={() => setView("dashboard")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex-1">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${progress}%`, background: accentColor }}
            />
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          Review
        </Badge>
      </div>

      {/* Review card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <Badge variant="secondary" className="text-xs">
                  {item.lang}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {dueItems.length}
                </span>
              </div>

              <div className="rounded-3xl border border-border/30 p-8 text-center mb-6"
                style={{ background: "oklch(1 0 0 / 5%)" }}
              >
                <p className="text-sm text-muted-foreground mb-3">Recall the answer</p>
                <h2 className="text-3xl font-bold mb-2">{item.prompt}</h2>
                {item.hint && !revealed && (
                  <p className="text-sm text-muted-foreground">Hint: {item.hint}</p>
                )}

                {!revealed ? (
                  <Button
                    onClick={() => setRevealed(true)}
                    className="mt-6 w-full h-12 font-semibold"
                    style={{ background: accentColor, color: "#fff" }}
                  >
                    Reveal Answer
                  </Button>
                ) : (
                  <div className="mt-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="text-2xl font-bold" style={{ color: accentColor }}>
                        {item.answer}
                      </div>
                      <button
                        onClick={speakAnswer}
                        className="size-9 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors"
                        style={{ color: accentColor }}
                        aria-label="Pronounce answer"
                      >
                        <Volume2 className="size-5" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">How well did you remember?</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={() => handleRate(0)}
                        variant="outline"
                        className="h-12 font-semibold border-destructive/40 text-destructive hover:bg-destructive/10"
                      >
                        Again
                      </Button>
                      <Button
                        onClick={() => handleRate(3)}
                        variant="outline"
                        className="h-12 font-semibold border-border/40"
                      >
                        Good
                      </Button>
                      <Button
                        onClick={() => handleRate(5)}
                        className="h-12 font-semibold"
                        style={{ background: accentColor, color: "#fff" }}
                      >
                        Easy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {!revealed && (
        <div className="text-center pb-6 text-xs text-muted-foreground">
          Tap "Reveal Answer" after you've tried to recall it
        </div>
      )}
    </div>
  )
}