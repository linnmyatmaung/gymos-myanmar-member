import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { dietPlan } from "@/mockdata/dietPlan";
import { member } from "@/mockdata/member";
import { motion } from "framer-motion";
import { Coffee, UtensilsCrossed, Moon, Cookie, Droplet, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/diet-plan")({
  component: DietPlanPage,
  head: () => ({ meta: [{ title: "Diet Plan · GymOS" }] }),
});

const mealIcon = {
  Breakfast: Coffee,
  Lunch: UtensilsCrossed,
  Dinner: Moon,
  Snacks: Cookie,
} as const;

function DietPlanPage() {
  const [activeDay, setActiveDay] = useState(0);
  const day = dietPlan[activeDay];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Nutrition"
        title="Diet Plan"
        subtitle="A balanced 7-day meal plan tuned for performance and recovery."
        actions={
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/40">
            <div className="size-7 rounded-full bg-secondary-container grid place-items-center">
              <User className="size-3.5 text-on-secondary-container" />
            </div>
            <div className="text-sm font-semibold text-on-surface">{member.trainer}</div>
          </div>
        }
      />

      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 -mx-1 px-1">
        {dietPlan.map((d, i) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(i)}
            className={cn(
              "shrink-0 px-5 py-3 rounded-2xl text-sm font-semibold transition-all",
              i === activeDay
                ? "bg-primary-container text-white shadow-elevated"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container",
            )}
          >
            {d.day.slice(0, 3)}
            <div className={cn("text-[10px] mt-0.5", i === activeDay ? "text-on-primary-container" : "text-outline")}>
              {dietPlan[i].totalCalories} kcal
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <NutritionCard label="Protein" value={`${day.protein}g`} pct={75} color="#006a61" />
        <NutritionCard label="Carbs" value={`${day.carbs}g`} pct={62} color="#131b2e" />
        <NutritionCard label="Fat" value={`${day.fat}g`} pct={48} color="#76777d" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {day.meals.map((meal, i) => {
            const Icon = mealIcon[meal.type];
            return (
              <motion.div
                key={`${day.day}-${meal.type}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="m3-card p-5 hover:shadow-elevated transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-2xl bg-secondary-container text-on-secondary-container grid place-items-center shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold text-on-surface">{meal.type}</h3>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface">
                        {meal.calories} kcal
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {meal.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <span className="size-1.5 rounded-full bg-secondary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        
      </div>
    </AppShell>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 rounded-2xl p-3 text-center">
      <div className="text-[10px] text-on-primary-container">{label}</div>
      <div className="font-display text-base font-bold">{value}</div>
    </div>
  );
}

function NutritionCard({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className="m3-card p-5">
      <div className="flex items-baseline justify-between">
        <div className="text-xs text-on-surface-variant">{label}</div>
        <div className="font-display text-2xl font-bold text-on-surface">{value}</div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-surface-container-high overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <div className="text-[10px] text-on-surface-variant mt-2">{pct}% of daily goal</div>
    </div>
  );
}
