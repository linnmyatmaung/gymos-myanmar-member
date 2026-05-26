import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { workoutPlan } from "@/mockdata/workoutPlan";
import { member } from "@/mockdata/member";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Dumbbell, Clock, Flame, User, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createEmptyWorkoutCompletion,
  loadWorkoutCompletion,
  saveWorkoutCompletion,
} from "@/lib/workout-progress";

export const Route = createFileRoute("/personal-plan")({
  component: PersonalPlan,
  head: () => ({ meta: [{ title: "Personal Plan · GymOS" }] }),
});

function PersonalPlan() {
  const [selectedExercise, setSelectedExercise] = useState<{
    name: string;
    focus: string;
    youtubeVideoId: string;
  } | null>(null);
  const [completed, setCompleted] = useState(() => createEmptyWorkoutCompletion(workoutPlan));
  const [open, setOpen] = useState<string | null>(workoutPlan.find((d) => !d.completed)?.day ?? "Monday");

  useEffect(() => {
    setCompleted(loadWorkoutCompletion(workoutPlan));
  }, []);

  const completedDays = workoutPlan.filter((d) =>
    d.exercises.every((e) => completed[d.day]?.has(e.name)),
  ).length;

  const toggleExercise = (day: string, name: string) => {
    setCompleted((prev) => {
      const next = { ...prev, [day]: new Set(prev[day]) };
      if (next[day].has(name)) next[day].delete(name);
      else next[day].add(name);
      saveWorkoutCompletion(next);
      return next;
    });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="7-Day Plan"
        title="Personal Plan"
        subtitle={`Crafted by your trainer to push you toward ${member.goal.toLowerCase()}.`}
        actions={
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/40">
            <div className="size-7 rounded-full bg-secondary-container grid place-items-center">
              <User className="size-3.5 text-on-secondary-container" />
            </div>
            <div className="text-sm font-semibold text-on-surface">{member.trainer}</div>
          </div>
        }
      />

      <div className="m3-card-elevated p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-on-surface-variant">Weekly completion</div>
            <div className="font-display text-2xl font-bold text-on-surface">
              Completed {completedDays} of 7 days
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-secondary">
            {Math.round((completedDays / 7) * 100)}%
          </div>
        </div>
        <div className="h-3 rounded-full bg-surface-container overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedDays / 7) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary-container"
          />
        </div>
      </div>

      <div className="space-y-3">
        {workoutPlan.map((day, i) => {
          const isOpen = open === day.day;
          const doneCount = day.exercises.filter((e) => completed[day.day]?.has(e.name)).length;
          const allDone = doneCount === day.exercises.length;
          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="m3-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : day.day)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-surface-container-low transition"
              >
                <div
                  className={cn(
                    "size-12 rounded-2xl grid place-items-center shrink-0 font-display font-bold",
                    allDone ? "bg-secondary text-white" : "bg-surface-container-highest text-on-surface",
                  )}
                >
                  {allDone ? <Check className="size-5" /> : day.day.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg font-semibold text-on-surface">{day.day}</div>
                  <div className="text-xs text-on-surface-variant">
                    {day.focus} · {day.exercises.length} exercises
                  </div>
                </div>
                <div className="hidden sm:block text-xs font-semibold text-on-surface-variant">
                  {doneCount}/{day.exercises.length}
                </div>
                <ChevronDown
                  className={cn("size-5 text-on-surface-variant transition-transform", isOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-2 border-t border-outline-variant/40 pt-4">
                      {day.exercises.map((ex) => {
                        const done = completed[day.day]?.has(ex.name);
                        return (
                          <div
                            role="button"
                            tabIndex={0}
                            key={ex.name}
                            onClick={() =>
                              setSelectedExercise({
                                name: ex.name,
                                focus: day.focus,
                                youtubeVideoId: ex.youtubeVideoId,
                              })
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setSelectedExercise({
                                  name: ex.name,
                                  focus: day.focus,
                                  youtubeVideoId: ex.youtubeVideoId,
                                });
                              }
                            }}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container",
                              done ? "bg-secondary-container/40" : "bg-surface-container-low",
                            )}
                          >
                            <div className="size-10 rounded-2xl bg-white grid place-items-center text-on-surface-variant">
                              <Dumbbell className="size-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={cn("font-semibold text-sm", done && "line-through text-on-surface-variant")}>
                                {ex.name}
                              </div>
                              <div className="text-xs text-on-surface-variant flex items-center gap-3 mt-0.5 flex-wrap">
                                <span>{ex.sets} × {ex.reps}</span>
                                <span className="flex items-center gap-1"><Clock className="size-3" /> {ex.duration}</span>
                                <span className="flex items-center gap-1"><Flame className="size-3" /> {ex.difficulty}</span>
                              </div>
                            </div>
                            <div className="hidden size-9 rounded-2xl bg-white text-on-surface-variant sm:grid place-items-center">
                              <PlayCircle className="size-4" />
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleExercise(day.day, ex.name);
                              }}
                              className={cn(
                                "size-9 rounded-2xl grid place-items-center transition",
                                done
                                  ? "bg-secondary text-white"
                                  : "bg-white border border-outline-variant/60 text-on-surface-variant hover:border-secondary hover:text-secondary",
                              )}
                            >
                              <Check className="size-4" />
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <ExerciseVideoDialog
        exercise={selectedExercise}
        onOpenChange={(open) => {
          if (!open) setSelectedExercise(null);
        }}
      />
    </AppShell>
  );
}

function ExerciseVideoDialog({
  exercise,
  onOpenChange,
}: {
  exercise: { name: string; focus: string; youtubeVideoId: string } | null;
  onOpenChange: (open: boolean) => void;
}) {
  const query = exercise ? `${exercise.name} exercise form tutorial` : "";
  const embedUrl = exercise
    ? `https://www.youtube-nocookie.com/embed/${exercise.youtubeVideoId}`
    : "";

  return (
    <Dialog open={!!exercise} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border-0 p-0 shadow-elevated">
        <DialogHeader className="px-6 pt-6">
          <div className="text-xs font-medium text-on-surface-variant">{exercise?.focus}</div>
          <DialogTitle className="font-display text-2xl font-bold text-on-surface">
            {exercise?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="aspect-video overflow-hidden rounded-2xl bg-black">
            {exercise && (
              <iframe
                key={exercise.name}
                title={`${exercise.name} YouTube tutorial`}
                src={embedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
          <a
            href={
              exercise
                ? `https://www.youtube.com/watch?v=${exercise.youtubeVideoId}`
                : `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
            }
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary-container px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container/90"
          >
            <PlayCircle className="size-4" />
            Open on YouTube
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
