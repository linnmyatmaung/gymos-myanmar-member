export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  youtubeVideoId: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
  completed?: boolean;
}

export const workoutPlan: WorkoutDay[] = [
  {
    day: "Monday",
    focus: "Chest & Triceps",
    completed: true,
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "8-10", duration: "12 min", difficulty: "Hard", youtubeVideoId: "rT7DgCr-3pg" },
      { name: "Incline Dumbbell Press", sets: 4, reps: "10", duration: "10 min", difficulty: "Moderate", youtubeVideoId: "8iPEnn-ltC8" },
      { name: "Cable Fly", sets: 3, reps: "12-15", duration: "8 min", difficulty: "Easy", youtubeVideoId: "Iwe6AmxVf7o" },
      { name: "Tricep Pushdown", sets: 4, reps: "12", duration: "9 min", difficulty: "Moderate", youtubeVideoId: "2-LAMcpzODU" },
    ],
  },
  {
    day: "Tuesday",
    focus: "Back & Biceps",
    completed: true,
    exercises: [
      { name: "Deadlift", sets: 4, reps: "6", duration: "15 min", difficulty: "Hard", youtubeVideoId: "op9kVnSso6Q" },
      { name: "Pull Ups", sets: 4, reps: "8-10", duration: "10 min", difficulty: "Hard", youtubeVideoId: "eGo4IYlbE5g" },
      { name: "Seated Row", sets: 3, reps: "12", duration: "9 min", difficulty: "Moderate", youtubeVideoId: "GZbfZ033f74" },
      { name: "Barbell Curl", sets: 3, reps: "10-12", duration: "7 min", difficulty: "Easy", youtubeVideoId: "kwG2ipFRgfo" },
    ],
  },
  {
    day: "Wednesday",
    focus: "Legs & Glutes",
    completed: true,
    exercises: [
      { name: "Back Squat", sets: 5, reps: "8", duration: "15 min", difficulty: "Hard", youtubeVideoId: "SW_C1A-rejs" },
      { name: "Romanian Deadlift", sets: 4, reps: "10", duration: "12 min", difficulty: "Moderate", youtubeVideoId: "JCXUYuzwNrM" },
      { name: "Walking Lunges", sets: 3, reps: "20", duration: "10 min", difficulty: "Moderate", youtubeVideoId: "L8fvypPrzzs" },
      { name: "Calf Raises", sets: 4, reps: "15", duration: "6 min", difficulty: "Easy", youtubeVideoId: "-M4-G8p8fmc" },
    ],
  },
  {
    day: "Thursday",
    focus: "Shoulders & Core",
    completed: true,
    exercises: [
      { name: "Overhead Press", sets: 4, reps: "8", duration: "12 min", difficulty: "Hard", youtubeVideoId: "2yjwXTZQDDI" },
      { name: "Lateral Raises", sets: 4, reps: "12", duration: "8 min", difficulty: "Easy", youtubeVideoId: "3VcKaXpzqRo" },
      { name: "Face Pulls", sets: 3, reps: "15", duration: "7 min", difficulty: "Easy", youtubeVideoId: "rep-qVOkqgk" },
      { name: "Hanging Leg Raises", sets: 4, reps: "12", duration: "8 min", difficulty: "Moderate", youtubeVideoId: "Pr1ieGZ5atk" },
    ],
  },
  {
    day: "Friday",
    focus: "Push Hypertrophy",
    exercises: [
      { name: "Dumbbell Bench Press", sets: 4, reps: "10", duration: "12 min", difficulty: "Moderate", youtubeVideoId: "VmB1G1K7v94" },
      { name: "Arnold Press", sets: 3, reps: "10", duration: "9 min", difficulty: "Moderate", youtubeVideoId: "6Z15_WdXmVw" },
      { name: "Dips", sets: 3, reps: "12", duration: "8 min", difficulty: "Hard", youtubeVideoId: "2z8JmcrW-As" },
      { name: "Skull Crushers", sets: 3, reps: "12", duration: "7 min", difficulty: "Easy", youtubeVideoId: "d_KZxkY_0cM" },
    ],
  },
  {
    day: "Saturday",
    focus: "Pull & Conditioning",
    exercises: [
      { name: "T-Bar Row", sets: 4, reps: "10", duration: "12 min", difficulty: "Moderate", youtubeVideoId: "j3Igk5nyZE4" },
      { name: "Lat Pulldown", sets: 4, reps: "12", duration: "10 min", difficulty: "Easy", youtubeVideoId: "CAwf7n6Luuc" },
      { name: "Hammer Curl", sets: 3, reps: "12", duration: "7 min", difficulty: "Easy", youtubeVideoId: "zC3nLlEvin4" },
      { name: "Rowing Machine", sets: 1, reps: "-", duration: "20 min", difficulty: "Moderate", youtubeVideoId: "H0r_ZPXJLtg" },
    ],
  },
  {
    day: "Sunday",
    focus: "Active Recovery",
    exercises: [
      { name: "Mobility Flow", sets: 1, reps: "-", duration: "20 min", difficulty: "Easy", youtubeVideoId: "g_tea8ZNk5A" },
      { name: "Foam Rolling", sets: 1, reps: "-", duration: "15 min", difficulty: "Easy", youtubeVideoId: "t4A523-O5uk" },
      { name: "Light Cycling", sets: 1, reps: "-", duration: "25 min", difficulty: "Easy", youtubeVideoId: "ksJFLPDG22o" },
    ],
  },
];
