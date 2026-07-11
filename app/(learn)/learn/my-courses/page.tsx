import { CourseCard } from "@/components/learn/mycourse/course-card";
import { fakeCourses } from "@/lib/fake-courses";

export default function MyCoursesPage() {
  return (
    <div className="p-6 md:p-8">

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
        Khóa học
      </h1>
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] justify-items-center gap-6">
        {fakeCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
