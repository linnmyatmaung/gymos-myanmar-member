import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Dumbbell,
  Salad,
  Flame,
  ScanLine,
  Sparkles,
  UserCircle,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const navItems = [
  { to: "/", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/personal-plan", labelKey: "nav.personalPlan", icon: Dumbbell },
  { to: "/diet-plan", labelKey: "nav.dietPlan", icon: Salad },
  { to: "/calorie-counter", labelKey: "nav.calories", icon: Flame },
  {
    to: "/pose-corrector",
    href: "https://huggingface.co/spaces/Ambatakam89/burmese-voice-pose-corrector",
    labelKey: "nav.poseAi",
    icon: ScanLine,
  },
  { to: "/profile", labelKey: "nav.profile", icon: UserCircle },
] as const;

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const router = useRouter();
  const user = getCurrentUser();
  const { t } = useI18n();
  const handleLogout = async () => {
    logout();
    await router.invalidate();
    await navigate({ to: "/login", search: { redirect: "/" }, replace: true });
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 p-5 bg-surface border-r border-outline-variant/40">
      <div className="flex items-center gap-3 px-3 py-4">
        <div className="size-10 rounded-2xl bg-primary-container text-white grid place-items-center shadow-glow">
          <Sparkles className="size-5 text-secondary-container" />
        </div>
        <div>
          <div className="font-display text-xl font-bold tracking-tight text-on-surface">GymOS</div>
          <div className="text-xs text-on-surface-variant">{t("app.memberPortal")}</div>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = path === item.to;
          const Icon = item.icon;
          const className = cn(
            "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group",
            active
              ? "text-on-surface"
              : "text-on-surface-variant hover:bg-surface-container/70 hover:text-on-surface",
          );

          const content = (
            <>
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-2xl bg-surface-container-highest"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="size-5 relative z-10" strokeWidth={active ? 2.4 : 1.8} />
              <span className={cn("relative z-10 text-sm", active && "font-semibold")}>{t(item.labelKey)}</span>
            </>
          );

          if ("href" in item) {
            return (
              <a key={item.to} href={item.href} className={className}>
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-surface-container-low p-3">
        <div className="px-1">
          <div className="truncate text-sm font-semibold text-on-surface">
            {user?.displayName ?? t("app.member")}
          </div>
          <div className="truncate text-xs text-on-surface-variant">{user?.username}</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <LogOut className="size-4" />
          {t("nav.signOut")}
        </button>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2">
      <div className="m3-card-elevated grid grid-cols-6 items-center gap-1 px-2 py-2 rounded-3xl">
        {navItems.map((item) => {
          const active = path === item.to;
          const Icon = item.icon;
          const className = "relative flex min-w-0 flex-col items-center gap-1 px-1 py-2";
          const content = (
            <>
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
                {t(item.labelKey)}
              </span>
            </>
          );

          if ("href" in item) {
            return (
              <a key={item.to} href={item.href} className={className}>
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={className}
            >
              {content}
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
