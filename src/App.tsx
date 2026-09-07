import { ProfilePage } from "@/pages/ProfilePage"
import { ReviewPage } from "@/pages/ReviewPage"
import { AnimatePresence, motion } from "framer-motion"
import { useAppStore } from "@/store/useAppStore"
import { LandingPage } from "@/pages/LandingPage"
import { SignupPage } from "@/pages/SignupPage"
import { LoginPage } from "@/pages/LoginPage"
import { OnboardingPage } from "@/pages/OnboardingPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { LessonPage } from "@/pages/LessonPage"
import { PathPage } from "@/pages/PathPage"
import { LanguagesPage } from "@/pages/LanguagesPage"
import { AchievementsPage } from "@/pages/AchievementsPage"

const PAGE_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

function AppRouter() {
  const { view, user, activeLanguage } = useAppStore()

  let resolvedView = view
  if (user && activeLanguage && view === "landing") {
    resolvedView = "dashboard"
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={resolvedView}
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25 }}
        className="min-h-screen"
      >
        {resolvedView === "landing" && <LandingPage />}
        {resolvedView === "signup" && <SignupPage />}
        {resolvedView === "login" && <LoginPage />}
        {resolvedView === "onboarding" && <OnboardingPage />}
        {resolvedView === "dashboard" && <DashboardPage />}
        {resolvedView === "lesson" && <LessonPage />}
        {resolvedView === "path" && <PathPage />}
        {resolvedView === "languages" && <LanguagesPage />}
        {resolvedView === "achievements" && <AchievementsPage />}
        {resolvedView === "profile" && <ProfilePage />}
        {resolvedView === "review" && <ReviewPage />}
      </motion.div>
    </AnimatePresence>
  )
}

export function App() {
  return <AppRouter />
}

export default App