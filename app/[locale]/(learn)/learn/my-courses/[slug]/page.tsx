import { CourseDetailView } from "@/components/learn/course-detail-view";
import { fakeCourses, formatPrice, getCourseBySlug } from "@/lib/fake-courses";
import { getLessonsByCourseId } from "@/lib/fake-lessons";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return fakeCourses.map((course) => ({ slug: course.slug }));
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const t = await getTranslations("learn.mycourses");
  const lessons = getLessonsByCourseId(course.id);
  const completedCount = lessons.filter((lesson) => lesson.isCompleted).length;
  return (
    <CourseDetailView
      course={course}
      lessons={lessons}
      formattedPrice={formatPrice(course.price)}
      labels={{
        back: t("detail.back"),
        students: t("cardCourse.students"),
        lessons: t("detail.lessons"),
        duration: t("detail.duration"),
        price: t("detail.price"),
        continue: t("detail.continue"),
        lessonsTitle: t("detail.lessonsTitle"),
        lessonCompleted: t("detail.lessonCompleted"),
        lessonLocked: t("detail.lessonLocked"),
        backToOverview: t("detail.backToOverview"),
        progress: t("detail.progress", {
          completed: completedCount,
          total: lessons.length,
        }),
        currentLesson: t("detail.currentLesson"),
      }}
    />
  );
}
