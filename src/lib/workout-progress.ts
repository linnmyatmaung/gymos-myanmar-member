import type { WorkoutDay, WorkoutExercise } from "@/mockdata/workoutPlan";

export type WorkoutCompletionSets = Record<string, Set<string>>;

export const WORKOUT_PROGRESS_EVENT = "movelux-workout-progress";

const STORAGE_KEY = "movelux-workout-progress-v1";
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function createEmptyWorkoutCompletion(plan: WorkoutDay[]): WorkoutCompletionSets {
  return Object.fromEntries(plan.map((day) => [day.day, new Set<string>()]));
}

function toStored(completion: WorkoutCompletionSets): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(completion).map(([day, exercises]) => [day, Array.from(exercises)]),
  );
}

function fromStored(plan: WorkoutDay[], stored: unknown): WorkoutCompletionSets {
  const completion = createEmptyWorkoutCompletion(plan);
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return completion;

  Object.entries(stored as Record<string, unknown>).forEach(([day, exercises]) => {
    if (Array.isArray(exercises)) {
      completion[day] = new Set(exercises.filter((exercise) => typeof exercise === "string"));
    }
  });

  return completion;
}

export function loadWorkoutCompletion(plan: WorkoutDay[]): WorkoutCompletionSets {
  if (typeof window === "undefined") return createEmptyWorkoutCompletion(plan);

  try {
    return fromStored(plan, JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}"));
  } catch {
    return createEmptyWorkoutCompletion(plan);
  }
}

export function saveWorkoutCompletion(completion: WorkoutCompletionSets) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStored(completion)));
  window.dispatchEvent(new Event(WORKOUT_PROGRESS_EVENT));
}

export function getTodayWorkout(plan: WorkoutDay[], date = new Date()) {
  const dayName = weekDays[date.getDay()];
  return plan.find((day) => day.day === dayName) ?? plan[0];
}

export function estimateExerciseCalories(exercise: WorkoutExercise) {
  const minutes = Number.parseInt(exercise.duration, 10);
  const caloriesPerMinute = {
    Easy: 4,
    Moderate: 7,
    Hard: 9,
  }[exercise.difficulty];

  return Math.round((Number.isNaN(minutes) ? 0 : minutes) * caloriesPerMinute);
}

export function getWorkoutSummary(day: WorkoutDay, completion: WorkoutCompletionSets) {
  const completed = completion[day.day] ?? new Set<string>();
  const completedExercises = day.exercises.filter((exercise) => completed.has(exercise.name));
  const caloriesBurned = completedExercises.reduce(
    (total, exercise) => total + estimateExerciseCalories(exercise),
    0,
  );

  return {
    completedCount: completedExercises.length,
    totalCount: day.exercises.length,
    caloriesBurned,
    isWorkoutComplete: completedExercises.length === day.exercises.length,
  };
}

export function getTodayWorkoutSummary(plan: WorkoutDay[], completion: WorkoutCompletionSets) {
  const todayWorkout = getTodayWorkout(plan);
  return {
    todayWorkout,
    ...getWorkoutSummary(todayWorkout, completion),
  };
}
