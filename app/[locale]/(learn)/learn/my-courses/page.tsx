import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";


// ✅ KHAI BÁO KIỂU DỮ LIỆU KHÓA HỌC
type Course = {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  slug: string;
  students: number;
};

// ✅ DỮ LIỆU GIẢ
const fakeCourses: Course[] = [
  {
    id: "course1",
    title: "React & Next.js Masterclass 2026",
    thumbnail: "/images/course-react.jpg", // Bạn có thể thay bằng URL ảnh thật
    price: 499000,
    slug: "react-nextjs-masterclass-2026",
    students: 1245,
  },
  {
    id: "course2",
    title: "Node.js & Express Backend Development",
    thumbnail: "/images/course-node.jpg",
    price: 399000,
    slug: "nodejs-express-backend-dev",
    students: 987,
  },
  {
    id: "course3",
    title: "TypeScript từ cơ bản đến nâng cao",
    thumbnail: "/images/course-ts.jpg",
    price: 299000,
    slug: "typescript-co-ban-den-nang-cao",
    students: 1562,
  },
  {
    id: "course4",
    title: "UI/UX Design with Figma",
    thumbnail: "/images/course-figma.jpg",
    price: 349000,
    slug: "ui-ux-design-figma",
    students: 723,
  },
];

// ✅ HÀM ĐỊNH DẠNG TIỀN TỆ VNĐ
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default async function MyCoursesPage() {
  const t = await getTranslations("learn.mycourses");

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
        {t("title") || "My Courses"}
      </h1>

      {/* ✅ LƯỚI HIỂN THỊ CÁC CARD KHÓA HỌC */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fakeCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            {/* Ảnh bìa khóa học */}
            <div className="relative w-full h-44 bg-slate-100">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
                // Thêm placeholder nếu ảnh chưa có
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
            </div>

            {/* Thông tin khóa học */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-slate-800 line-clamp-2 min-h-[40px]">
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

              {/* Nút Học Ngay */}
              <Link
                href={`/learn/my-courses/${course.slug}`}
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
