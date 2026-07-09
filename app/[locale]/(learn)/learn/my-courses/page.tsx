import { Link } from "@/i18n/navigation";
import { fakeCourses, formatPrice } from "@/lib/fake-courses";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function MyCoursesPage() {
  const t = await getTranslations("learn.mycourses");

  return (
    <div className="p-6 md:p-8 ">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
        {t("title") || "My Courses"}
      </h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fakeCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative w-full h-44 bg-slate-100">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
            </div>

            <div className="p-4">
              <h3 className="text-base font-semibold text-slate-800 line-clamp-2 min-h-10">
                {course.title}
              </h3>

              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <span>
                  👥 {course.students.toLocaleString()}{" "}
                  {t("cardCourse.students")}
                </span>
                <span className="font-medium text-amber-600">
                  {formatPrice(course.price)}
                </span>
              </div>

              <Link
                href={{
                  pathname: "/learn/my-courses/[slug]",
                  params: { slug: course.slug },
                }}
                className="mt-4 block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-lg transition-colors duration-200"
              >
                {t("cardCourse.btnLearn") || "Học ngay"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
