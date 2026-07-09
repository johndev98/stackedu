import { cn } from "@/lib/utils";
import type { Lesson } from "@/lib/fake-lessons";
import { CheckCircle2, Clock, Lock, PlayCircle } from "lucide-react";

type LessonCardProps = {
  lesson: Lesson;
  labels: {
    completed: string;
    locked: string;
  };
};

export function LessonCard({ lesson, labels }: LessonCardProps) {
  const isActive = !lesson.isCompleted && !lesson.isLocked;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-white p-4 transition-shadow",
        lesson.isLocked
          ? "border-slate-200 opacity-60"
          : "border-slate-200 hover:border-amber-200 hover:shadow-sm",
        isActive && "border-amber-300 bg-amber-50/40",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
          lesson.isCompleted
            ? "bg-emerald-100 text-emerald-700"
            : lesson.isLocked
              ? "bg-slate-100 text-slate-400"
              : "bg-amber-100 text-amber-700",
        )}
      >
        {lesson.isCompleted ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          lesson.order
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-800 md:text-base">
          {lesson.title}
        </h3>
        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 md:text-sm">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {lesson.duration}
          </span>
          {lesson.isCompleted && (
            <span className="text-emerald-600">{labels.completed}</span>
          )}
          {lesson.isLocked && (
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Lock className="h-3.5 w-3.5" />
              {labels.locked}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0">
        {lesson.isLocked ? (
          <Lock className="h-5 w-5 text-slate-300" />
        ) : (
          <PlayCircle
            className={cn(
              "h-6 w-6",
              lesson.isCompleted
                ? "text-emerald-500"
                : isActive
                  ? "text-amber-500"
                  : "text-slate-400",
            )}
          />
        )}
      </div>
    </div>
  );
}
