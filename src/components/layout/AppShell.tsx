import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Dumbbell, Salad, Flame, ScanLine, Sparkles, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/personal-plan", label: "Personal Plan", icon: Dumbbell },
  { to: "/diet-plan", label: "Diet Plan", icon: Salad },
  { to: "/calorie-counter", label: "Calories", icon: Flame },
  { to: "/pose-corrector", label: "Pose AI", icon: ScanLine },
  { to: "/profile", label: "Profile", icon: UserCircle },
] as const;

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 p-5 bg-surface border-r border-outline-variant/40">
      <div className="flex items-center gap-3 px-3 py-4">
        <div className="size-10 rounded-2xl bg-primary-container text-white grid place-items-center shadow-glow">
          <Sparkles className="size-5 text-secondary-container" />
        </div>
        <div>
          <div className="font-display text-xl font-bold tracking-tight text-on-surface">GymOS</div>
          <div className="text-xs text-on-surface-variant">Member Portal</div>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = path === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group",
                active
                  ? "text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container/70 hover:text-on-surface",
              )}
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-2xl bg-surface-container-highest"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="size-5 relative z-10" strokeWidth={active ? 2.4 : 1.8} />
              <span className={cn("relative z-10 text-sm", active && "font-semibold")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

     
    </aside>
  );
}

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2">
      <div className="m3-card-elevated grid grid-cols-6 items-center gap-1 px-2 py-2 rounded-3xl">
        {navItems.map((item) => {
          const active = path === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex min-w-0 flex-col items-center gap-1 px-1 py-2"
            >
              <div
                className={cn(
                  "relative size-9 sm:size-10 rounded-2xl grid place-items-center transition-colors",
                  active ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant",
                )}
              >
                <Icon className="size-4 sm:size-5" strokeWidth={active ? 2.4 : 1.8} />
              </div>
              <span
                className={cn(
                  "w-full truncate text-center text-[9px] sm:text-[10px]",
                  active ? "text-on-surface font-semibold" : "text-on-surface-variant",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-surface">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-28 lg:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
