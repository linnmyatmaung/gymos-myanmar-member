import { useState } from "react";
import { attendance, type AttendanceStatus } from "@/mockdata/attendance";
import { exercisesForDate } from "@/mockdata/exercises";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, X, Calendar, Dumbbell, Bed, CalendarClock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusColor: Record<AttendanceStatus, string> = {
  present: "bg-secondary text-white",
  absent: "bg-red-600 text-white",
  rest: "bg-surface-container-high text-on-surface-variant border border-dashed border-outline-variant",
  scheduled: "bg-primary-container/10 text-primary-container border border-primary-container/30",
};

const statusLabel: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  rest: "Rest day",
  scheduled: "Trainer assigned",
};

export function AttendanceCalendar() {
  const [selected, setSelected] = useState<string | null>(null);
  const today = new Date();
  const monthLabel = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDow = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const selectedDay = selected ? attendance.find((d) => d.date === selected) : null;
  const exercises = selected ? exercisesForDate(selected) : [];

  return (
    <div className="m3-card-elevated p-6 lg:mx-auto lg:max-w-3xl lg:p-5 xl:max-w-none xl:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <Calendar className="size-4" />
            Attendance
          </div>
          <h3 className="font-display text-xl font-bold text-on-surface mt-1">{monthLabel}</h3>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 text-[10px] text-on-surface-variant">
          <Legend color="bg-secondary" label="Present" />
          <Legend color="bg-red-600" label="Absent" />
          <Legend color="bg-surface-container-high border border-dashed border-outline-variant" label="Rest day" />
          <Legend color="bg-primary-container/10 border border-primary-container/30" label="Assigned" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold text-on-surface-variant mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {attendance.map((d) => {
          const day = parseInt(d.date.split("-")[2]);
          const isToday = day === today.getDate();
          return (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              key={d.date}
              onClick={() => setSelected(d.date)}
              className={cn(
                "aspect-square rounded-xl text-xs font-semibold flex items-center justify-center transition-shadow",
                statusColor[d.status],
                isToday && "ring-2 ring-primary-container ring-offset-2 ring-offset-white",
              )}
            >
              {day}
            </motion.button>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg rounded-3xl border-0 shadow-elevated p-0 overflow-hidden">
          <div className="bg-primary-container text-white p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 size-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center"
            >
              <X className="size-4" />
            </button>
            <DialogHeader>
              <div className="text-xs text-on-primary-container">
                {selected &&
                  new Date(selected).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
              </div>
              <DialogTitle className="font-display text-2xl font-bold mt-1">
                {selectedDay ? statusLabel[selectedDay.status] : "—"}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {selectedDay?.status === "absent" && (
              <StatusMessage
                icon={X}
                title="Marked absent"
                text="This was a planned training day, but no gym check-in was recorded."
                tone="absent"
              />
            )}
            {selectedDay?.status === "rest" && (
              <StatusMessage
                icon={Bed}
                title="Rest day"
                text="No workout was assigned for this day. Recovery is part of the plan."
                tone="rest"
              />
            )}
            {selectedDay?.status === "scheduled" && (
              <StatusMessage
                icon={CalendarClock}
                title="Upcoming workout"
                text="Your trainer has assigned this as a future training day."
                tone="scheduled"
              />
            )}
            <AnimatePresence>
              {selectedDay?.status !== "rest" && exercises.map((ex, i) => (
                <motion.div
                  key={ex.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container-low transition mb-1.5 last:mb-0"
                >
                  <div
                    className={cn(
                      "size-10 rounded-2xl grid place-items-center shrink-0",
                      ex.status === "completed"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container text-on-surface-variant",
                    )}
                  >
                    {ex.status === "completed" ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <Clock className="size-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-on-surface flex items-center gap-2">
                      <Dumbbell className="size-3.5 text-on-surface-variant" />
                      {ex.name}
                    </div>
                    <div className="text-xs text-on-surface-variant mt-0.5">
                      {ex.sets} sets · {ex.reps} reps · {ex.duration}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                      ex.status === "completed"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container-high text-on-surface-variant",
                    )}
                  >
                    {ex.status}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-sm", color)} />
      <span>{label}</span>
    </div>
  );
}

function StatusMessage({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  tone: "absent" | "rest" | "scheduled";
}) {
  const toneClass = {
    absent: "bg-red-50 text-red-700",
    rest: "bg-surface-container-low text-on-surface-variant",
    scheduled: "bg-primary-container/10 text-primary-container",
  };

  return (
    <div className={cn("mb-4 flex gap-3 rounded-2xl p-4 text-left", toneClass[tone])}>
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs opacity-80">{text}</div>
      </div>
    </div>
  );
}
