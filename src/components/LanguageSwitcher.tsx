import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useAppStore, type Language } from "@/store/useAppStore"
import { getLanguageConfig, LANGUAGES } from "@/data/languages"
import { ChevronDown, Plus } from "lucide-react"

export function LanguageSwitcher() {
  const { activeLanguage, setActiveLanguage, languagesProgress, setView } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)

  const currentConfig = activeLanguage ? getLanguageConfig(activeLanguage) : null
  const addedLanguages = (Object.entries(languagesProgress) as [Language, typeof languagesProgress[Language]][])
    .filter(([, progress]) => progress.onboardingComplete)
    .map(([lang]) => lang)

  const availableLanguages = LANGUAGES.filter((l) => addedLanguages.includes(l.id as Language))
  const canAddLanguage = addedLanguages.length < 3

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all hover:bg-accent glass text-sm font-medium"
      >
        <span className="text-lg">{currentConfig?.flag}</span>
        <span className="hidden sm:inline max-w-xs truncate">{currentConfig?.name}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-4 shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 z-50 mt-2 min-w-[240px] rounded-2xl border border-border/30 glass-strong p-2 shadow-lg"
          >
            <div className="space-y-1">
              {availableLanguages.map((lang) => {
                const isActive = activeLanguage === lang.id
                const progress = languagesProgress[lang.id as Language]

                return (
                  <motion.button
                    key={lang.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveLanguage(lang.id as Language)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all"
                    style={{
                      background: isActive
                        ? `color-mix(in oklch, ${lang.accentColor} 15%, transparent)`
                        : "transparent",
                      borderColor: isActive ? lang.accentColor : "transparent",
                    }}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground">{lang.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {progress.xp.toLocaleString()} XP · Streak {progress.streak}
                      </div>
                    </div>
                    {isActive && (
                      <div
                        className="size-2.5 rounded-full shrink-0"
                        style={{ background: lang.accentColor }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {canAddLanguage && (
              <>
                <div className="my-2 h-px bg-border/30" />
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setView("languages")
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                >
                  <Plus className="size-4" />
                  Add Language
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
