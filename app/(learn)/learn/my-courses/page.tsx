
import { CourseCard } from "@/components/learn/mycourse/course-card";
import { TimeProvider } from "@/lib/contexts/time-context";
import { fakeCourses } from "@/lib/fake-courses";

export default function MyCoursesPage() {
  return (
    <TimeProvider>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Khóa học
        </h1>

        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 justify-items-center">
          {fakeCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>
      </div>
    </TimeProvider>
  );
}