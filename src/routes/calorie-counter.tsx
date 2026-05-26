import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Flame, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/calorie-counter")({
  component: CalorieCounterPage,
  head: () => ({ meta: [{ title: "Calorie Counter · GymOS" }] }),
});

function CalorieCounterPage() {
  return (
    <AppShell>
      <ComingSoonHero
        icon={Flame}
        eyebrow="Coming soon"
        title="Calorie Counter"
        subtitle="This module is coming soon."
        route="/gymos/caloriecounter"
      />
    </AppShell>
  );
}

export function ComingSoonHero({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  route,
}: {
  icon: any;
  eyebrow: string;
  title: string;
  subtitle: string;
  route: string;
}) {
  return (
    <div className="min-h-[70vh] grid place-items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-2xl m3-card-elevated p-10 sm:p-14 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-primary-container to-tertiary-container" />
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 size-72 rounded-full bg-secondary-container/40 blur-3xl" />

        <div className="relative text-white">
          <motion.div
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="size-20 rounded-3xl bg-white/10 backdrop-blur grid place-items-center mx-auto mb-6 ring-1 ring-white/20"
          >
            <Icon className="size-9 text-secondary-container" />
          </motion.div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary-container bg-white/10 px-3 py-1 rounded-full">
            <Sparkles className="size-3" />
            {eyebrow}
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold mt-5 tracking-tight">{title}</h1>
          <p className="text-on-primary-container mt-3 max-w-sm mx-auto">{subtitle}</p>

          <button className="mt-8 inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform">
            {route}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
