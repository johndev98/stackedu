export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  duration: string;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
};

export const fakeLessons: Lesson[] = [
  // course1 — React & Next.js
  {
    id: "lesson1-1",
    course_id: "course1",
    title: "Giới thiệu React 19 & Setup dự án",
    duration: "15:20",
    order: 1,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: "lesson1-2",
    course_id: "course1",
    title: "JSX, Components & Props",
    duration: "22:45",
    order: 2,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: "lesson1-3",
    course_id: "course1",
    title: "State, Events & Forms",
    duration: "28:10",
    order: 3,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "lesson1-4",
    course_id: "course1",
    title: "useEffect & Data Fetching",
    duration: "35:00",
    order: 4,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "lesson1-5",
    course_id: "course1",
    title: "Next.js App Router cơ bản",
    duration: "40:15",
    order: 5,
    isCompleted: false,
    isLocked: true,
  },
  {
    id: "lesson1-6",
    course_id: "course1",
    title: "Server Components vs Client Components",
    duration: "38:30",
    order: 6,
    isCompleted: false,
    isLocked: true,
  },

  // course2 — Node.js
  {
    id: "lesson2-1",
    course_id: "course2",
    title: "Node.js Fundamentals",
    duration: "18:00",
    order: 1,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: "lesson2-2",
    course_id: "course2",
    title: "Express Routing & Middleware",
    duration: "25:30",
    order: 2,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "lesson2-3",
    course_id: "course2",
    title: "REST API Design",
    duration: "32:00",
    order: 3,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "lesson2-4",
    course_id: "course2",
    title: "MongoDB Integration",
    duration: "28:45",
    order: 4,
    isCompleted: false,
    isLocked: true,
  },
  {
    id: "lesson2-5",
    course_id: "course2",
    title: "JWT Authentication",
    duration: "30:20",
    order: 5,
    isCompleted: false,
    isLocked: true,
  },

  // course3 — TypeScript
  {
    id: "lesson3-1",
    course_id: "course3",
    title: "Kiểu dữ liệu cơ bản & Type Inference",
    duration: "20:15",
    order: 1,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: "lesson3-2",
    course_id: "course3",
    title: "Interfaces, Types & Union",
    duration: "24:40",
    order: 2,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "lesson3-3",
    course_id: "course3",
    title: "Generics & Utility Types",
    duration: "31:10",
    order: 3,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "lesson3-4",
    course_id: "course3",
    title: "TypeScript với React",
    duration: "27:55",
    order: 4,
    isCompleted: false,
    isLocked: true,
  },
  {
    id: "lesson3-5",
    course_id: "course3",
    title: "TypeScript với Node.js",
    duration: "26:30",
    order: 5,
    isCompleted: false,
    isLocked: true,
  },

  // course4 — Figma
  {
    id: "lesson4-1",
    course_id: "course4",
    title: "Giới thiệu UI/UX & Figma Workspace",
    duration: "16:50",
    order: 1,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: "lesson4-2",
    course_id: "course4",
    title: "Wireframe & User Flow",
    duration: "23:20",
    order: 2,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "lesson4-3",
    course_id: "course4",
    title: "Color, Typography & Layout",
    duration: "29:00",
    order: 3,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: "lesson4-4",
    course_id: "course4",
    title: "Components & Auto Layout",
    duration: "34:15",
    order: 4,
    isCompleted: false,
    isLocked: true,
  },
  {
    id: "lesson4-5",
    course_id: "course4",
    title: "Design System & Prototyping",
    duration: "36:40",
    order: 5,
    isCompleted: false,
    isLocked: true,
  },
];

export function getLessonsByCourseId(courseId: string) {
  return fakeLessons
    .filter((lesson) => lesson.course_id === courseId)
    .sort((a, b) => a.order - b.order);
}
