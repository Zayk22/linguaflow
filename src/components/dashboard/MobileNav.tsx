import { useAppStore } from "@/store/useAppStore"
import { BarChart2, Map, BookOpen, Target, User } from "lucide-react"

interface MobileNavProps {
  accentColor?: string
  onPath: () => void
  onLesson: () => void
}

export function MobileNav({ onPath, onLesson }: MobileNavProps) {
  const { setView, user } = useAppStore()

  const handleProfile = () => {
    if (!user || user.isGuest) {
      setView("signup")
    } else {
      setView("profile")
    }
  }

  const items = [
    { icon: BarChart2, label: "Home", action: () => setView("dashboard") },
    { icon: Map, label: "Path", action: onPath },
    { icon: BookOpen, label: "Lessons", action: onLesson },
    { icon: Target, label: "Goals", action: () => setView("achievements") },
    { icon: User, label: "Profile", action: handleProfile },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-background/90 backdrop-blur-xl">
      <div className="flex">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <item.icon className="size-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}