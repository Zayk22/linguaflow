import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Mail, LogOut } from "lucide-react"
import { motion } from "framer-motion"

export function ProfilePage() {
  const { user, logout, setView } = useAppStore()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Please sign in first.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => setView("dashboard")}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/30 p-6 space-y-6"
          style={{ background: "oklch(1 0 0 / 4%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">
                {user.isGuest ? "Guest" : "Member"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user.email || "No email (guest)"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {user.isGuest ? "Guest account" : "Full account"}
              </span>
            </div>
          </div>

          <Button
            onClick={logout}
            variant="destructive"
            className="w-full gap-2"
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  )
}