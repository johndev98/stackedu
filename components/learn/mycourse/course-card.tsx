// ✅ THÊM DÒNG NÀY Ở ĐẦU FILE, TRƯỚC TẤT CẢ IMPORT
"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/fake-courses";
import type { Course } from "@/lib/fake-courses";

type Props = { course: Course };

export function CourseCard({ course }: Props) {
  return (
    <div className="w-full min-w-65 max-w-[320px] min-h-95 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Ảnh bìa */}
      <div className="relative w-full h-44 shrink-0 overflow-hidden bg-slate-100">
        {/* Placeholder "StackEdu" - LUÔN Ở DƯỚI */}
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-100">
          <span className="text-xl font-bold tracking-wider text-slate-400 select-none">
            StackEdu
          </span>
        </div>

        {/* ẢNH: ẨN HẾT KHI TẢI LỖI → KHÔNG CÒN VIỀN */}
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover z-10 animate-fade-in bg-transparent"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Nội dung */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="text-base font-semibold text-slate-800 line-clamp-2 min-h-10 leading-5">
          {course.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>👥 {course.students.toLocaleString()} Học viên</span>
          <span className="font-medium text-amber-600">
            {formatPrice(course.price)}
          </span>
        </div>

        <Link
          href={`/learn/my-courses/${course.slug}`}
          className="mt-auto block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-lg transition-colors duration-200"
        >
          Học ngay
        </Link>
      </div>
    </div>
  );
}
