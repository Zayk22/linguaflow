import { playCorrectSound, playIncorrectSound, playCompletionSound, playXpSound } from "@/lib/sounds"
import { speakText } from "@/lib/speech"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useAppStore } from "@/store/useAppStore"
import { getLanguageConfig, getLearningPath } from "@/data/languages"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X, Zap, Check, RefreshCw, Trophy, Target, BadgeCheck, Volume2 } from "lucide-react"
import confetti from "canvas-confetti"

type QuestionType = "multiple-choice" | "typing" | "flashcard" | "listening"

interface Question {
  type: QuestionType
  prompt: string
  answer: string
  options?: string[]
  hint?: string
  audio?: string
}

function getQuestionsForLesson(lessonId: string): Question[] {
  const lessonQuestions: Record<string, Question[]> = {
    "es-greet": [
      { type: "multiple-choice", prompt: 'How do you say "Hello" in Spanish?', answer: "Hola", options: ["Hola", "Bonjour", "Ciao", "Guten Tag"], hint: "Think warm greeting" },
      { type: "typing", prompt: 'Translate: "Good morning"', answer: "Buenos días", hint: "Buen... días" },
      { type: "multiple-choice", prompt: 'What does "Buenos noches" mean?', answer: "Good night", options: ["Good morning", "Good afternoon", "Good night", "Goodbye"], hint: "Think evening" },
      { type: "flashcard", prompt: "¿Cómo estás?", answer: "How are you?", hint: "Common greeting question" },
      { type: "typing", prompt: 'Translate: "See you later"', answer: "Hasta luego", hint: "Hasta..." },
    ],
    "jp-vowels": [
      { type: "multiple-choice", prompt: "What is the hiragana for 'a'?", answer: "あ", options: ["あ", "い", "う", "え"], hint: "First vowel" },
      { type: "typing", prompt: "Type the hiragana for 'ka'", answer: "か", hint: "か" },
      { type: "multiple-choice", prompt: "What sound does 'う' make?", answer: "u", options: ["a", "i", "u", "e"], hint: "Third vowel" },
      { type: "flashcard", prompt: "お", answer: "o (as in 'o'clock)", hint: "Fifth vowel" },
      { type: "multiple-choice", prompt: "Which is 'e' in hiragana?", answer: "え", options: ["あ", "い", "え", "お"], hint: "Fourth vowel" },
    ],
    "tr-greet": [
      { type: "multiple-choice", prompt: 'How do you say "Hello" in Turkish?', answer: "Merhaba", options: ["Merhaba", "Günaydın", "İyi akşamlar", "Hoşça kal"], hint: "Common greeting" },
      { type: "typing", prompt: 'Translate: "Good morning"', answer: "Günaydın", hint: "Gün = day" },
      { type: "flashcard", prompt: "Teşekkür ederim", answer: "Thank you", hint: "Formal thanks" },
      { type: "multiple-choice", prompt: 'What does "İyi geceler" mean?', answer: "Good night", options: ["Good morning", "Good evening", "Good night", "Goodbye"], hint: "İyi = good, gece = night" },
      { type: "typing", prompt: 'Translate: "Goodbye"', answer: "Hoşça kal", hint: "Hoş..." },
    ],
  }

  return lessonQuestions[lessonId] ?? []
}

export function LessonPage() {
  const { setView, activeLanguage, activeLessonId, completeLesson, getActiveLanguageProgress } = useAppStore()

  const langProgress = getActiveLanguageProgress()
  if (!langProgress || !activeLanguage) {
    return <div className="flex items-center justify-center min-h-screen">No active language</div>
  }

  const langConfig = getLanguageConfig(activeLanguage)
  const path = getLearningPath(activeLanguage, langProgress.skillLevel)
  const allLessons = path.flatMap((u) => u.lessons)
  const lesson =
    allLessons.find((l) => l.id === activeLessonId) ??
    allLessons.find((l) => !l.locked) ??
    allLessons[0]

  const accentColor = langConfig?.accentColor ?? "oklch(0.65 0.22 38)"
  const glowColor = langConfig?.glowColor ?? "oklch(0.65 0.22 38 / 30%)"

  const questions = getQuestionsForLesson(lesson?.id ?? "")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [typingAnswer, setTypingAnswer] = useState("")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [cardFlipped, setCardFlipped] = useState(false)
  const [lessonComplete, setLessonComplete] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const question = questions[questionIndex]
  const progress = questions.length > 0 ? ((questionIndex) / questions.length) * 100 : 0

  useEffect(() => {
    setTypingAnswer("")
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
    setCardFlipped(false)
  }, [questionIndex])

  const checkAnswer = (answer: string) => {
    const correct = answer.trim().toLowerCase() === question.answer.trim().toLowerCase()
    setIsCorrect(correct)
    setShowResult(true)
    if (correct) {
      setCorrectCount((c) => c + 1)
      playCorrectSound()
    } else {
      playIncorrectSound()
    }
  }

  const handleNext = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1)
    } else {
      if (lesson) {
        completeLesson(activeLanguage, lesson.id, lesson.xp)
      }
      setLessonComplete(true)
      playCompletionSound()
      setTimeout(() => playXpSound(), 600)
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
      })
    }
  }

  const speakAnswer = () => {
    if (question?.answer) {
      // Use language code based on active language
      const langCode = activeLanguage === "spanish" ? "es-ES" : activeLanguage === "japanese" ? "ja-JP" : "tr-TR"
      speakText(question.answer, langCode)
    }
  }

  if (!lesson || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground flex-col gap-4">
        <p>No lesson available</p>
        <Button onClick={() => setView("dashboard")}>Back to Dashboard</Button>
      </div>
    )
  }

  if (lessonComplete) {
    return (
      <LessonComplete
        lesson={lesson}
        xp={lesson.xp}
        correctCount={correctCount}
        totalCount={questions.length}
        accentColor={accentColor}
        glowColor={glowColor}
        onContinue={() => setView("dashboard")}
        langFlag={langConfig?.flag ?? ""}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${glowColor}, transparent), oklch(0.08 0 0)` }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 md:px-8">
        <button onClick={() => setView("dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-5" />
        </button>
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: accentColor }}>
          <Zap className="size-4" />
          <span>+{lesson.xp} XP</span>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <Badge variant="secondary" className="text-xs">
                  {lesson.title}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {questionIndex + 1} / {questions.length}
                </span>
              </div>

              {question.type === "multiple-choice" && (
                <MultipleChoice
                  question={question}
                  selectedOption={selectedOption}
                  showResult={showResult}
                  isCorrect={isCorrect}
                  accentColor={accentColor}
                  onSelect={(opt) => {
                    if (!showResult) {
                      setSelectedOption(opt)
                      checkAnswer(opt)
                    }
                  }}
                />
              )}

              {question.type === "typing" && (
                <TypingExercise
                  question={question}
                  value={typingAnswer}
                  showResult={showResult}
                  isCorrect={isCorrect}
                  accentColor={accentColor}
                  onChange={setTypingAnswer}
                  onSubmit={() => {
                    if (!showResult && typingAnswer.trim()) checkAnswer(typingAnswer)
                  }}
                />
              )}

              {question.type === "flashcard" && (
                <Flashcard
                  question={question}
                  flipped={cardFlipped}
                  accentColor={accentColor}
                  glowColor={glowColor}
                  onFlip={() => {
                    setCardFlipped(true)
                    if (!showResult) {
                      setIsCorrect(true)
                      setShowResult(true)
                      playCorrectSound()
                    }
                  }}
                />
              )}

              {question.type === "listening" && (
                <ListeningExercise
                  question={question}
                  selectedOption={selectedOption}
                  showResult={showResult}
                  isCorrect={isCorrect}
                  accentColor={accentColor}
                  onSelect={(opt) => {
                    if (!showResult) {
                      setSelectedOption(opt)
                      checkAnswer(opt)
                    }
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Feedback + continue */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border/30 px-4 py-5 md:px-8"
            style={{
              background: isCorrect
                ? "oklch(0.4 0.15 140 / 20%)"
                : "oklch(0.4 0.2 25 / 20%)",
            }}
          >
            <div className="max-w-lg mx-auto flex items-center justify-between">
              <div>
                <p
                  className="font-bold text-lg"
                  style={{ color: isCorrect ? "oklch(0.7 0.18 140)" : "oklch(0.7 0.2 25)" }}
                >
                  {isCorrect ? (
                    <span className="flex items-center gap-2">
                      <BadgeCheck className="size-5" />
                      Correct!
                    </span>
                  ) : (
                    "Not quite"
                  )}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Answer: <span className="text-foreground font-medium">{question.answer}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={speakAnswer}
                  className="size-10 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors"
                  style={{ color: accentColor }}
                  aria-label="Pronounce answer"
                >
                  <Volume2 className="size-5" />
                </button>
                <Button
                  onClick={handleNext}
                  className="gap-2 font-semibold px-6"
                  style={{
                    background: isCorrect ? "oklch(0.6 0.18 140)" : accentColor,
                    color: "#fff",
                  }}
                >
                  {questionIndex < questions.length - 1 ? "Continue" : "Finish"}
                  <ArrowLeft className="size-4 rotate-180" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MultipleChoice({
  question,
  selectedOption,
  showResult,
  isCorrect,
  accentColor,
  onSelect,
}: {
  question: Question
  selectedOption: string | null
  showResult: boolean
  isCorrect: boolean
  accentColor: string
  onSelect: (opt: string) => void
}) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-2">Choose the correct answer</p>
      <h2 className="text-2xl font-bold mb-8">{question.prompt}</h2>
      <div className="grid grid-cols-2 gap-3">
        {question.options?.map((opt) => {
          const selected = selectedOption === opt
          const correct = showResult && opt === question.answer
          const wrong = showResult && selected && !isCorrect

          return (
            <motion.button
              key={opt}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => onSelect(opt)}
              className="rounded-2xl border p-4 text-left font-medium transition-all"
              style={{
                borderColor: correct
                  ? "oklch(0.6 0.18 140)"
                  : wrong
                  ? "oklch(0.6 0.2 25)"
                  : selected
                  ? accentColor
                  : "oklch(1 0 0 / 12%)",
                background: correct
                  ? "oklch(0.4 0.15 140 / 25%)"
                  : wrong
                  ? "oklch(0.4 0.2 25 / 25%)"
                  : selected
                  ? `color-mix(in oklch, ${accentColor} 20%, transparent)`
                  : "oklch(1 0 0 / 4%)",
              }}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function TypingExercise({
  question,
  value,
  showResult,
  isCorrect,
  accentColor,
  onChange,
  onSubmit,
}: {
  question: Question
  value: string
  showResult: boolean
  isCorrect: boolean
  accentColor: string
  onChange: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-2">Type your answer</p>
      <h2 className="text-2xl font-bold mb-8">{question.prompt}</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          disabled={showResult}
          placeholder={question.hint ?? "Type your answer..."}
          className="w-full rounded-2xl border border-border/40 bg-input/30 px-4 py-4 text-lg font-medium outline-none placeholder:text-muted-foreground/50 focus:border-border/60 disabled:opacity-60 transition-all"
          style={showResult ? {
            borderColor: isCorrect ? "oklch(0.6 0.18 140)" : "oklch(0.6 0.2 25)",
          } : {}}
          autoFocus
        />
        {!showResult && (
          <Button
            onClick={onSubmit}
            disabled={!value.trim()}
            className="w-full h-11 font-semibold"
            style={{ background: accentColor, color: "#fff" }}
          >
            Check Answer
          </Button>
        )}
      </div>
    </div>
  )
}

function Flashcard({
  question,
  flipped,
  accentColor,
  glowColor,
  onFlip,
}: {
  question: Question
  flipped: boolean
  accentColor: string
  glowColor: string
  onFlip: () => void
}) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-2">Tap the card to reveal</p>
      <h2 className="text-2xl font-bold mb-8">What does this mean?</h2>

      <motion.div
        onClick={onFlip}
        style={{ perspective: 1000, cursor: "pointer" }}
        className="w-full"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: "preserve-3d", position: "relative", height: 200 }}
        >
          <div
            className="absolute inset-0 rounded-3xl border border-border/30 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: "hidden", background: "oklch(1 0 0 / 5%)" }}
          >
            <div className="text-4xl font-bold" style={{ color: accentColor }}>
              {question.prompt}
            </div>
            <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1.5">
              <RefreshCw className="size-3.5" />
              Tap to reveal
            </p>
          </div>

          <div
            className="absolute inset-0 rounded-3xl border flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: accentColor,
              background: glowColor,
            }}
          >
            <Check className="size-6 mb-2" style={{ color: accentColor }} />
            <div className="text-2xl font-bold text-center px-4">{question.answer}</div>
            {question.hint && (
              <p className="text-sm text-muted-foreground mt-2 text-center px-4">{question.hint}</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {!flipped && (
        <Button
          onClick={onFlip}
          className="w-full mt-6 h-11 font-semibold"
          style={{ background: accentColor, color: "#fff" }}
        >
          Reveal Answer
        </Button>
      )}
    </div>
  )
}

function ListeningExercise({
  question,
  selectedOption,
  showResult,
  isCorrect,
  accentColor,
  onSelect,
}: {
  question: Question
  selectedOption: string | null
  showResult: boolean
  isCorrect: boolean
  accentColor: string
  onSelect: (opt: string) => void
}) {
  return (
    <MultipleChoice
      question={question}
      selectedOption={selectedOption}
      showResult={showResult}
      isCorrect={isCorrect}
      accentColor={accentColor}
      onSelect={onSelect}
    />
  )
}

function LessonComplete({
  lesson,
  xp,
  correctCount,
  totalCount,
  accentColor,
  glowColor,
  onContinue,
  langFlag,
}: {
  lesson: { title: string; icon: string }
  xp: number
  correctCount: number
  totalCount: number
  accentColor: string
  glowColor: string
  onContinue: () => void
  langFlag: string
}) {
  const accuracy = Math.round((correctCount / totalCount) * 100)

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: `radial-gradient(ellipse 80% 60% at 50% 20%, ${glowColor}, oklch(0.08 0 0))` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 flex justify-center"
        >
          <Trophy className="size-20" style={{ color: accentColor }} />
        </motion.div>

        <h2 className="text-3xl font-bold mb-2">Lesson Complete!</h2>
        <p className="text-muted-foreground mb-8">
          {lesson.title} &middot; {langFlag}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "XP Earned", value: `+${xp}`, icon: Zap },
            { label: "Accuracy", value: `${accuracy}%`, icon: Target },
            { label: "Correct", value: `${correctCount}/${totalCount}`, icon: BadgeCheck },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/30 p-4"
              style={{ background: "oklch(1 0 0 / 5%)" }}
            >
              <stat.icon className="size-6 mx-auto mb-1" style={{ color: accentColor }} />
              <div className="font-bold text-lg" style={{ color: accentColor }}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <Button
          onClick={onContinue}
          size="lg"
          className="w-full h-12 font-bold gap-2 text-base"
          style={{ background: accentColor, color: "#fff" }}
        >
          Continue Learning
          <ArrowLeft className="size-4 rotate-180" />
        </Button>
      </motion.div>
    </div>
  )
}