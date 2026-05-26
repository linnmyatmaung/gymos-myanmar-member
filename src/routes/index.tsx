import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarDays,
  Crown,
  Dumbbell,
  Flame,
  Percent,
  UserRoundCheck,
} from "lucide-react";
import { AttendanceCalendar } from "@/components/calendar/AttendanceCalendar";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { analytics } from "@/mockdata/analytics";
import { member } from "@/mockdata/member";
import { workoutPlan } from "@/mockdata/workoutPlan";
import {
  createEmptyWorkoutCompletion,
  getTodayWorkoutSummary,
  loadWorkoutCompletion,
  WORKOUT_PROGRESS_EVENT,
} from "@/lib/workout-progress";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "Dashboard · GymOS" }],
  }),
});

function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const [completion, setCompletion] = useState(() => createEmptyWorkoutCompletion(workoutPlan));
  const todaySummary = getTodayWorkoutSummary(workoutPlan, completion);
  const nextWorkout = getNextWorkoutDay();

  useEffect(() => {
    const syncCompletion = () => setCompletion(loadWorkoutCompletion(workoutPlan));

    syncCompletion();
    window.addEventListener(WORKOUT_PROGRESS_EVENT, syncCompletion);
    window.addEventListener("storage", syncCompletion);
    return () => {
      window.removeEventListener(WORKOUT_PROGRESS_EVENT, syncCompletion);
      window.removeEventListener("storage", syncCompletion);
    };
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${analytics.streak} day streak`}
        title={`${greeting}, ${member.name.split(" ")[0]}`}
        subtitle="Today's training, attendance and next trainer-assigned workout at a glance."
        actions={
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="hidden items-center gap-2 rounded-full bg-secondary-container px-4 py-2.5 text-sm font-semibold text-on-secondary-container sm:flex"
          >
            <Crown className="size-4" />
            {member.membership}
          </motion.div>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Workouts completed today"
          value={`${todaySummary.completedCount}/${todaySummary.totalCount}`}
          icon={Dumbbell}
          delta={todaySummary.isWorkoutComplete ? "Done" : "Today"}
          accent="primary"
          index={0}
        />
        <StatCard
          label="Calories burned today (approx.)"
          value={todaySummary.caloriesBurned}
          icon={Flame}
          delta="Est."
          accent="secondary"
          index={1}
        />
        <StatCard
          label="Active days"
          value={analytics.activeDays}
          icon={CalendarCheck}
          delta="3 days"
          accent="tertiary"
          index={2}
        />
        <StatCard
          label="Attendance"
          value={`${analytics.attendancePercent}%`}
          icon={Percent}
          delta="4%"
          accent="primary"
          index={3}
        />
      </div>

      <NextWorkoutCard nextWorkout={nextWorkout} />

      <AttendanceCalendar />
    </AppShell>
  );
}

function getNextWorkoutDay() {
  const todayIndex = new Date().getDay();
  const weekOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  for (let offset = 0; offset < weekOrder.length; offset += 1) {
    const day = weekOrder[(todayIndex + offset) % weekOrder.length];
    const plan = workoutPlan.find((item) => item.day === day && item.focus !== "Active Recovery");
    if (plan && !plan.completed) {
      return {
        ...plan,
        relativeDay: offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : day,
      };
    }
  }

  const fallback = workoutPlan.find((item) => item.focus !== "Active Recovery") ?? workoutPlan[0];
  return { ...fallback, relativeDay: fallback.day };
}

function NextWorkoutCard({ nextWorkout }: { nextWorkout: ReturnType<typeof getNextWorkoutDay> }) {
  const totalMinutes = nextWorkout.exercises.reduce((total, exercise) => {
    const minutes = Number.parseInt(exercise.duration, 10);
    return total + (Number.isNaN(minutes) ? 0 : minutes);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="m3-card-elevated mb-8 grid gap-5 p-6 lg:grid-cols-[1fr_auto]"
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
          <CalendarDays className="size-4" />
          Next trainer-assigned workout
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold text-on-surface">
          {nextWorkout.relativeDay}: {nextWorkout.focus}
        </h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant">
          <UserRoundCheck className="size-4" />
          Assigned by {member.trainer}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
        <FixtureStat label="Exercises" value={nextWorkout.exercises.length} />
        <FixtureStat label="Approx. time" value={`${totalMinutes} min`} />
      </div>
    </motion.div>
  );
}

function FixtureStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-surface-container-low px-4 py-3 text-center">
      <div className="font-display text-xl font-bold text-on-surface">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase text-on-surface-variant">{label}</div>
    </div>
  );
}
