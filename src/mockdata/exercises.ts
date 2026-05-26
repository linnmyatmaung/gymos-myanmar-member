export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration: string;
  status: "completed" | "upcoming" | "skipped";
}

export const dayExercises: Record<string, Exercise[]> = {
  default: [
    { name: "Barbell Bench Press", sets: 4, reps: "8-10", duration: "12 min", status: "completed" },
    { name: "Incline Dumbbell Press", sets: 4, reps: "10", duration: "10 min", status: "completed" },
    { name: "Cable Fly", sets: 3, reps: "12-15", duration: "8 min", status: "completed" },
    { name: "Tricep Pushdown", sets: 4, reps: "12", duration: "9 min", status: "upcoming" },
    { name: "Overhead Tricep Extension", sets: 3, reps: "10-12", duration: "7 min", status: "upcoming" },
    { name: "Treadmill Cooldown", sets: 1, reps: "—", duration: "15 min", status: "upcoming" },
  ],
};

export function exercisesForDate(_date: string): Exercise[] {
  return dayExercises.default;
}
