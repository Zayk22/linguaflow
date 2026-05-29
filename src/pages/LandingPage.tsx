import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LANGUAGES } from "@/data/languages"
import { ArrowRight, Globe, Zap, Star, Play, Users, Trophy } from "lucide-react"

const FLOATING_WORDS = [
  { word: "こんにちは", lang: "Japanese", color: "text-pink-400" },
  { word: "Hola", lang: "Spanish", color: "text-orange-400" },
  { word: "Merhaba", lang: "Turkish", color: "text-amber-400" },
  { word: "日本語", lang: "Japanese", color: "text-rose-400" },
  { word: "¿Qué tal?", lang: "Spanish", color: "text-red-400" },
  { word: "Teşekkür", lang: "Turkish", color: "text-orange-300" },
  { word: "すごい！", lang: "Japanese", color: "text-fuchsia-400" },
  { word: "Buenas", lang: "Spanish", color: "text-amber-300" },
]

const STATS = [
  { value: "2M+", label: "Learners", icon: Users },
  { value: "3", label: "Languages", icon: Globe },
  { value: "95%", label: "Completion Rate", icon: Trophy },
]

export function LandingPage() {
  const { setView, signupAsGuest } = useAppStore()
  const [activeLanguage, setActiveLanguage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLanguage((prev) => (prev + 1) % LANGUAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const current = LANGUAGES[activeLanguage]

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -20%, ${current.glowColor}, transparent)`,
        }}
      />

      {/* Floating words background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {FLOATING_WORDS.map((item, i) => (
          <motion.div
            key={item.word}
            className={`absolute text-lg font-semibold ${item.color} opacity-10 select-none`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.15, 0.08, 0.15, 0],
              y: [0, -30, -60],
              x: [0, Math.sin(i * 0.7) * 20, Math.sin(i * 0.7) * 40],
            }}
            transition={{
              duration: 8 + i * 1.2,
              repeat: Infinity,
              delay: i * 1.1,
              ease: "easeInOut",
            }}
            style={{
              left: `${8 + (i * 12) % 85}%`,
              top: `${15 + (i * 13) % 70}%`,
            }}
          >
            {item.word}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <div
            className="size-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: current.accentColor }}
          >
            L
          </div>
          <span className="text-xl font-bold tracking-tight">LinguaFlow</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("login")}
            className="text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={() => setView("signup")}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Get Started
          </Button>
        </motion.div>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-24 md:px-12 md:pt-24">
        <div className="flex flex-col items-center text-center">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Badge
              variant="secondary"
              className="mb-8 gap-1.5 py-1.5 px-4 text-sm border border-border/50"
            >
              <Zap className="size-3.5" style={{ color: current.accentColor }} />
              Premium Language Learning
            </Badge>
          </motion.div>

          {/* Main headline with animated language */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl font-extrabold tracking-tight text-balance md:text-7xl lg:text-8xl"
          >
            Master{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={current.id}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.5 }}
                style={{ color: current.accentColor }}
              >
                {current.name}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-2 text-5xl font-extrabold tracking-tight text-muted-foreground md:text-7xl lg:text-8xl"
          >
            Fluently.
          </motion.h2>

          {/* Animated language symbol */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`symbol-${current.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="mt-8 flex items-center gap-3"
            >
              <span className="text-3xl">{current.flag}</span>
              <span
                className="text-2xl font-bold tracking-wide"
                style={{ color: current.accentColor }}
              >
                {current.symbol}
              </span>
              <span className="text-muted-foreground text-sm">— {current.symbolMeaning}</span>
            </motion.div>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed"
          >
            An immersive, cinematic language learning experience designed for modern learners.
            Built with science-backed methods. Powered by obsession.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              size="lg"
              onClick={() => setView("signup")}
              className="gap-2 px-8 text-base font-semibold"
              style={{
                background: current.accentColor,
                color: "#fff",
              }}
            >
              Start Learning Free
              <ArrowRight className="size-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => setView("login")}
              className="gap-2 px-8 text-base border-border/40"
            >
              Sign In
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={signupAsGuest}
              className="gap-2 px-8 text-base text-muted-foreground"
            >
              <Play className="size-4" />
              Try as Guest
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 grid grid-cols-3 gap-8 md:gap-16"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="size-5 text-muted-foreground mb-1" />
                <span className="text-2xl font-bold md:text-3xl">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Language cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-24 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {LANGUAGES.map((lang, i) => (
            <motion.button
              key={lang.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
              onClick={() => {
                setView("signup")
              }}
              className="glass rounded-2xl p-6 text-left transition-all hover:glow-lang cursor-pointer"
              style={
                {
                  "--lang-glow": lang.glowColor,
                } as React.CSSProperties
              }
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-4xl">{lang.flag}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
              <div
                className="mb-1 text-xl font-bold"
                style={{ color: lang.accentColor }}
              >
                {lang.symbol}
              </div>
              <h3 className="text-lg font-semibold">{lang.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{lang.tagline}</p>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="size-3.5"
                    style={{ color: lang.accentColor }}
                    fill={lang.accentColor}
                  />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">5.0</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {[
            { label: "Streak Tracking", icon: "🔥" },
            { label: "XP System", icon: "⚡" },
            { label: "AI Lessons", icon: "🧠" },
            { label: "Offline Mode", icon: "📱" },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="glass rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <span className="text-xl">{feature.icon}</span>
              <span className="text-sm font-medium">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 LinguaFlow · Premium Language Learning</p>
      </footer>
    </div>
  )
}
