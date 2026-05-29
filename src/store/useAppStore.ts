import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  | "profile"   // ← added this

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

export interface LanguageProgress {
  xp: number
  streak: number
  lastActiveDate?: string
  skillLevel: SkillLevel
  learningGoal: LearningGoal
  dailyGoal: DailyGoal
  lessonProgress: Record<string, LessonProgress>
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
}

const DEFAULT_LANGUAGE_PROGRESS: LanguageProgress = {
  xp: 0,
  streak: 0,
  skillLevel: "beginner",
  learningGoal: "travel",
  dailyGoal: 10,
  lessonProgress: {},
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
              },
            },
          }
        }),

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