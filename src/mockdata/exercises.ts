import { workoutPlan, type WorkoutDay } from "@/mockdata/workoutPlan";

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration: string;
  status: "completed" | "upcoming" | "skipped";
}

type AttendanceWorkoutStatus = "present" | "absent" | "rest" | "scheduled";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseDateKey(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function relativeDayLabel(date: Date, today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((target.getTime() - start.getTime()) / 86_400_000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return weekdays[target.getDay()];
}

export function workoutForDate(date: string): WorkoutDay | undefined {
  const weekday = weekdays[parseDateKey(date).getDay()];
  return workoutPlan.find((item) => item.day === weekday);
}

export function exercisesForDate(
  date: string,
  attendanceStatus: AttendanceWorkoutStatus = "scheduled",
): Exercise[] {
  const workout = workoutForDate(date);
  if (!workout) return [];

  const status: Exercise["status"] =
    attendanceStatus === "absent"
      ? "skipped"
      : attendanceStatus === "scheduled"
        ? "upcoming"
        : "completed";

  return workout.exercises.map((exercise) => ({
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
    duration: exercise.duration,
    status,
  }));
}

export function getNextTrainerAssignedWorkout(today = new Date()) {
  for (let offset = 1; offset <= 7; offset += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const dateKey = formatDateKey(date);
    const workout = workoutForDate(dateKey);

    if (workout && workout.focus !== "Active Recovery") {
      return {
        ...workout,
        date: dateKey,
        relativeDay: relativeDayLabel(date, today),
      };
    }
  }

  const fallback = workoutPlan.find((item) => item.focus !== "Active Recovery") ?? workoutPlan[0];
  return {
    ...fallback,
    date: formatDateKey(today),
    relativeDay: fallback.day,
  };
}
