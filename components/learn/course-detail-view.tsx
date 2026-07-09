"use client";

import { Link } from "@/i18n/navigation";
import type { Course } from "@/lib/fake-courses";
import type { Lesson } from "@/lib/fake-lessons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type CourseDetailLabels = {
  back: string;
  students: string;
  lessons: string;
  duration: string;
  price: string;
  continue: string;
  lessonsTitle: string;
  lessonCompleted: string;
  lessonLocked: string;
  backToOverview: string;
  progress: string;
  currentLesson: string;
};

type CourseDetailViewProps = {
  course: Course;
  lessons: Lesson[];
  formattedPrice: string;
  labels: CourseDetailLabels;
};

const SLIDE_TRANSITION = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.8,
} as const;

function LessonGridCard({
  lesson,
  labels,
}: {
  lesson: Lesson;
  labels: Pick<
    CourseDetailLabels,
    "lessonCompleted" | "lessonLocked" | "currentLesson"
  >;
}) {
  const isCurrent = !lesson.isCompleted && !lesson.isLocked;

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-white p-5 transition-all duration-200",
        lesson.isLocked
          ? "border-slate-200 opacity-70"
          : "border-slate-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md",
        isCurrent &&
          "border-amber-300 bg-gradient-to-b from-amber-50/80 to-white shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
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

        {lesson.isCompleted && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {labels.lessonCompleted}
          </span>
        )}
        {lesson.isLocked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            <Lock className="h-3 w-3" />
            {labels.lessonLocked}
          </span>
        )}
        {isCurrent && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
            {labels.currentLesson}
          </span>
        )}
      </div>

      <h3 className="mt-4 line-clamp-2 min-h-[48px] text-base font-semibold leading-snug text-slate-900">
        {lesson.title}
      </h3>

      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          {lesson.duration}
        </span>

        {lesson.isLocked ? (
          <Lock className="h-5 w-5 text-slate-300" />
        ) : (
          <PlayCircle
            className={cn(
              "h-7 w-7 transition-transform group-hover:scale-110",
              lesson.isCompleted
                ? "text-emerald-500"
                : isCurrent
                  ? "text-amber-500"
                  : "text-slate-400",
            )}
          />
        )}
      </div>
    </article>
  );
}

export function CourseDetailView({
  course,
  lessons,
  formattedPrice,
  labels,
}: CourseDetailViewProps) {
  const [view, setView] = useState<"detail" | "lessons">("detail");
  const completedCount = lessons.filter((lesson) => lesson.isCompleted).length;

  return (
    <div className="overflow-hidden p-6 md:p-8">
      <Link
        href="/learn/my-courses"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {labels.back}
      </Link>

      <div className="relative mt-6 overflow-hidden">
        <motion.div
          animate={{ x: view === "detail" ? "0%" : "-50%" }}
          transition={SLIDE_TRANSITION}
          className="flex w-[200%]"
        >
          {/* Tab 1: Course detail */}
          <section className="w-1/2 shrink-0 pr-0 md:pr-2">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    priority
                  />
                </div>

                <h1 className="mt-6 text-2xl font-bold text-slate-900 md:text-3xl">
                  {course.title}
                </h1>

                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {course.description}
                </p>
              </div>

              <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-amber-600" />
                    <span>
                      {course.students.toLocaleString()} {labels.students}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                    <span>
                      {course.lessons} {labels.lessons}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span>
                      {course.duration} {labels.duration}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-200 pt-5">
                  <p className="text-sm text-slate-500">{labels.price}</p>
                  <p className="mt-1 text-2xl font-bold text-amber-600">
                    {formattedPrice}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setView("lessons")}
                  className="mt-5 w-full rounded-lg bg-amber-500 py-2.5 font-medium text-white transition-colors hover:bg-amber-600"
                >
                  {labels.continue}
                </button>
              </aside>
            </div>
          </section>

          {/* Tab 2: Lessons list */}
          <section className="w-1/2 shrink-0 pl-0 md:pl-2">
            <button
              type="button"
              onClick={() => setView("detail")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {labels.backToOverview}
            </button>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-amber-600">
                    {labels.lessonsTitle}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">
                    {course.title}
                  </h2>
                </div>
                <p className="text-sm text-slate-600">{labels.progress}</p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{
                    width: `${lessons.length ? (completedCount / lessons.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {lessons.map((lesson) => (
                <LessonGridCard
                  key={lesson.id}
                  lesson={lesson}
                  labels={{
                    lessonCompleted: labels.lessonCompleted,
                    lessonLocked: labels.lessonLocked,
                    currentLesson: labels.currentLesson,
                  }}
                />
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
