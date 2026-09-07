import { create } from "zustand"
import { persist } from "zustand/middleware"
import { VOCABULARY_ITEMS } from "@/data/vocabulary"

export type Language = "spanish" | "japanese" | "turkish"
export type SkillLevel = "beginner" | "intermediate" | "advanced"
export type LearningGoal = "travel" | "career" | "conversation" | "anime" | "culture"
export type DailyGoal = 5 | 10 | 20 | 30
export type AppView =
  | "landing"
  | "login"
  | "signup"
  | "onboarding"
  | "dashboard"
  | "lesson"
  | "path"
  | "languages"
  | "achievements"
  | "profile"
  | "review"

export interface UserProfile {
  name: string
  email: string
  isGuest: boolean
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  xp: number
  completedAt?: string
}

export interface ReviewItem {
  id: string
  lang: Language
  prompt: string
  answer: string
  hint?: string
  interval: number
  easeFactor: number
  repetitions: number
  dueDate: string
  lastReviewedAt?: string
}

export interface LanguageProgress {
  xp: number
  streak: number
  lastActiveDate?: string
  skillLevel: SkillLevel
  learningGoal: LearningGoal
  dailyGoal: DailyGoal
  lessonProgress: Record<string, LessonProgress>
  reviewItems: Record<string, ReviewItem>
  onboardingComplete: boolean
  addedDate: string
}

interface AppState {
  view: AppView
  user: UserProfile | null
  activeLanguage: Language | null
  languagesProgress: Record<Language, LanguageProgress>
  onboardingStep: number
  activeLessonId: string | null

  setView: (view: AppView) => void
  setUser: (user: UserProfile | null) => void
  setActiveLanguage: (lang: Language) => void
  addLanguage: (lang: Language, skillLevel: SkillLevel, goal: LearningGoal, dailyGoal: DailyGoal) => void
  updateLanguageProgress: (lang: Language, updates: Partial<LanguageProgress>) => void
  completeLesson: (lang: Language, lessonId: string, xp: number) => void
  setOnboardingStep: (step: number) => void
  setActiveLessonId: (id: string | null) => void
  logout: () => void
  signupAsGuest: () => void
  getActiveLanguageProgress: () => LanguageProgress | null
  addReviewItem: (lang: Language, item: ReviewItem) => void
  reviewItem: (lang: Language, itemId: string, quality: 0 | 3 | 5) => void
  getDueReviewItems: (lang: Language) => ReviewItem[]
}

const DEFAULT_LANGUAGE_PROGRESS: LanguageProgress = {
  xp: 0,
  streak: 0,
  skillLevel: "beginner",
  learningGoal: "travel",
  dailyGoal: 10,
  lessonProgress: {},
  reviewItems: {},
  onboardingComplete: false,
  addedDate: new Date().toISOString(),
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "landing",
      user: null,
      activeLanguage: null,
      languagesProgress: {
        spanish: { ...DEFAULT_LANGUAGE_PROGRESS },
        japanese: { ...DEFAULT_LANGUAGE_PROGRESS },
        turkish: { ...DEFAULT_LANGUAGE_PROGRESS },
      },
      onboardingStep: 0,
      activeLessonId: null,

      setView: (view) => set({ view }),
      setUser: (user) => set({ user }),
      setActiveLanguage: (activeLanguage) => set({ activeLanguage }),
      setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
      setActiveLessonId: (activeLessonId) => set({ activeLessonId }),

      addLanguage: (lang, skillLevel, goal, dailyGoal) =>
        set((state) => ({
          languagesProgress: {
            ...state.languagesProgress,
            [lang]: {
              ...DEFAULT_LANGUAGE_PROGRESS,
              skillLevel,
              learningGoal: goal,
              dailyGoal,
              onboardingComplete: true,
            },
          },
          activeLanguage: lang,
        })),

      updateLanguageProgress: (lang, updates) =>
        set((state) => ({
          languagesProgress: {
            ...state.languagesProgress,
            [lang]: {
              ...state.languagesProgress[lang],
              ...updates,
            },
          },
        })),

      completeLesson: (lang, lessonId, xp) =>
        set((state) => {
          const current = state.languagesProgress[lang]

          // Add vocabulary items for this lesson to the review queue
          const newReviewItems = { ...current.reviewItems }
          for (const vocab of VOCABULARY_ITEMS.filter((v) => v.sourceLessonId === lessonId)) {
            if (!newReviewItems[vocab.id]) {
              newReviewItems[vocab.id] = {
                id: vocab.id,
                lang: vocab.lang,
                prompt: vocab.prompt,
                answer: vocab.answer,
                hint: vocab.hint,
                interval: 0,
                easeFactor: 2.5,
                repetitions: 0,
                dueDate: new Date().toISOString(),
              }
            }
          }

          return {
            languagesProgress: {
              ...state.languagesProgress,
              [lang]: {
                ...current,
                xp: current.xp + xp,
                lessonProgress: {
                  ...current.lessonProgress,
                  [lessonId]: {
                    lessonId,
                    completed: true,
                    xp,
                    completedAt: new Date().toISOString(),
                  },
                },
                reviewItems: newReviewItems,
              },
            },
          }
        }),

      addReviewItem: (lang, item) =>
        set((state) => ({
          languagesProgress: {
            ...state.languagesProgress,
            [lang]: {
              ...state.languagesProgress[lang],
              reviewItems: {
                ...state.languagesProgress[lang].reviewItems,
                [item.id]: item,
              },
            },
          },
        })),

      reviewItem: (lang, itemId, quality) =>
        set((state) => {
          const current = state.languagesProgress[lang]
          const item = current.reviewItems[itemId]
          if (!item) return state

          let repetitions = item.repetitions
          let interval = item.interval
          let easeFactor = item.easeFactor

          if (quality < 3) {
            repetitions = 0
            interval = 0
            easeFactor = Math.max(1.3, easeFactor - 0.2)
          } else {
            repetitions += 1
            if (repetitions === 1) {
              interval = 1
            } else if (repetitions === 2) {
              interval = 3
            } else {
              interval = Math.round(interval * easeFactor)
            }
            easeFactor += (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
            easeFactor = Math.max(1.3, easeFactor)
          }

          const dueDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString()
          const updatedItem: ReviewItem = {
            ...item,
            repetitions,
            interval,
            easeFactor,
            dueDate,
            lastReviewedAt: new Date().toISOString(),
          }

          return {
            languagesProgress: {
              ...state.languagesProgress,
              [lang]: {
                ...current,
                reviewItems: {
                  ...current.reviewItems,
                  [itemId]: updatedItem,
                },
              },
            },
          }
        }),

      getDueReviewItems: (lang) => {
        const state = get()
        const now = new Date()
        const items = state.languagesProgress[lang].reviewItems
        return Object.values(items)
          .filter((item) => new Date(item.dueDate) <= now)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      },

      logout: () =>
        set({
          view: "landing",
          user: null,
          activeLanguage: null,
          onboardingStep: 0,
        }),

      signupAsGuest: () =>
        set({
          user: { name: "Guest", email: "", isGuest: true },
          view: "onboarding",
          onboardingStep: 0,
        }),

      getActiveLanguageProgress: () => {
        const state = get()
        if (!state.activeLanguage) return null
        return state.languagesProgress[state.activeLanguage]
      },
    }),
    {
      name: "linguaflow-state",
      partialize: (state) => ({
        user: state.user,
        activeLanguage: state.activeLanguage,
        languagesProgress: state.languagesProgress,
        onboardingStep: state.onboardingStep,
        activeLessonId: state.activeLessonId,
      }),
    }
  )
)