import { getTranslations } from "next-intl/server";

export default async function MyCoursesPage() {
  const t = await getTranslations("learn.home");
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">My Courses</h1>
      <p className="mt-1 text-sm text-slate-600">
        Nơi bạn xây dựng toàn bộ giao diện giống hình PBD bên phải
      </p>
    </div>
  );
}
