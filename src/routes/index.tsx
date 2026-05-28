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
import { getNextTrainerAssignedWorkout } from "@/mockdata/exercises";
import { member } from "@/mockdata/member";
import { workoutPlan } from "@/mockdata/workoutPlan";
import {
  createEmptyWorkoutCompletion,
  getTodayWorkoutSummary,
  loadWorkoutCompletion,
  WORKOUT_PROGRESS_EVENT,
} from "@/lib/workout-progress";
import { useI18n, type TranslationKey } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "Dashboard · GymOS" }],
  }),
});

function Dashboard() {
  const { t } = useI18n();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("dashboard.goodMorning") : hour < 18 ? t("dashboard.goodAfternoon") : t("dashboard.goodEvening");
  const [completion, setCompletion] = useState(() => createEmptyWorkoutCompletion(workoutPlan));
  const todaySummary = getTodayWorkoutSummary(workoutPlan, completion);
  const nextWorkout = getNextTrainerAssignedWorkout();

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
        eyebrow={t("dashboard.streak", { count: analytics.streak })}
        title={`${greeting}, ${member.name.split(" ")[0]}`}
        subtitle={t("dashboard.subtitle")}
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
          label={t("dashboard.workoutsCompletedToday")}
          value={`${todaySummary.completedCount}/${todaySummary.totalCount}`}
          icon={Dumbbell}
          delta={todaySummary.isWorkoutComplete ? t("dashboard.done") : t("dashboard.today")}
          accent="primary"
          index={0}
        />
        <StatCard
          label={t("dashboard.caloriesBurnedToday")}
          value={todaySummary.caloriesBurned}
          icon={Flame}
          delta={t("dashboard.estimated")}
          accent="secondary"
          index={1}
        />
        <StatCard
          label={t("dashboard.activeDays")}
          value={analytics.activeDays}
          icon={CalendarCheck}
          delta={`3 ${t("dashboard.days")}`}
          accent="tertiary"
          index={2}
        />
        <StatCard
          label={t("dashboard.attendance")}
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

function NextWorkoutCard({ nextWorkout }: { nextWorkout: ReturnType<typeof getNextTrainerAssignedWorkout> }) {
  const { t } = useI18n();
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
          {t("dashboard.nextWorkout")}
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold text-on-surface">
          {t(`day.${nextWorkout.relativeDay}` as TranslationKey)}: {nextWorkout.focus}
        </h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant">
          <UserRoundCheck className="size-4" />
          {t("dashboard.assignedBy", { trainer: member.trainer })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
        <FixtureStat label={t("dashboard.exercises")} value={nextWorkout.exercises.length} />
        <FixtureStat label={t("dashboard.approxTime")} value={t("dashboard.minutes", { count: totalMinutes })} />
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
