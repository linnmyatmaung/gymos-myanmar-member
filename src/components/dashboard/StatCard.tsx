import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  delta?: string;
  trend?: "up" | "down";
  accent?: "primary" | "secondary" | "tertiary";
  index?: number;
}

export function StatCard({ label, value, icon: Icon, delta, trend = "up", accent = "primary", index = 0 }: StatCardProps) {
  const accentMap = {
    primary: "bg-primary-container text-white",
    secondary: "bg-secondary-container text-on-secondary-container",
    tertiary: "bg-surface-container-highest text-on-surface",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="m3-card p-5 hover:shadow-elevated transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className={cn("size-11 rounded-2xl grid place-items-center", accentMap[accent])}>
          <Icon className="size-5" />
        </div>
        {delta && (
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-full",
              trend === "up"
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-error-container text-on-error-container",
            )}
          >
            {trend === "up" ? "↑" : "↓"} {delta}
          </span>
        )}
      </div>
      <div className="mt-5">
        <div className="font-display text-3xl font-bold text-on-surface tracking-tight">{value}</div>
        <div className="text-xs text-on-surface-variant mt-1">{label}</div>
      </div>
    </motion.div>
  );
}
