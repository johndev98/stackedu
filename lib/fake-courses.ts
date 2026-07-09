export type Course = {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  slug: string;
  students: number;
  description: string;
  lessons: number;
  duration: string;
};

export const fakeCourses: Course[] = [
  {
    id: "course1",
    title: "React & Next.js Masterclass 2026",
    thumbnail: "/images/course-react.jpg",
    price: 499000,
    slug: "react-nextjs-masterclass-2026",
    students: 1245,
    description:
      "Xây dựng ứng dụng web hiện đại với React 19, Next.js App Router, Server Components và các pattern production-ready.",
    lessons: 6,
    duration: "32h",
  },
  {
    id: "course2",
    title: "Node.js & Express Backend Development",
    thumbnail: "/images/course-node.jpg",
    price: 399000,
    slug: "nodejs-express-backend-dev",
    students: 987,
    description:
      "Thiết kế REST API, xử lý authentication, kết nối database và triển khai backend với Node.js và Express.",
    lessons: 5,
    duration: "24h",
  },
  {
    id: "course3",
    title: "TypeScript từ cơ bản đến nâng cao",
    thumbnail: "/images/course-ts.jpg",
    price: 299000,
    slug: "typescript-co-ban-den-nang-cao",
    students: 1562,
    description:
      "Làm chủ TypeScript từ kiểu dữ liệu cơ bản đến generics, utility types và tích hợp vào dự án React/Node.",
    lessons: 5,
    duration: "18h",
  },
  {
    id: "course4",
    title: "UI/UX Design with Figma",
    thumbnail: "/images/course-figma.jpg",
    price: 349000,
    slug: "ui-ux-design-figma",
    students: 723,
    description:
      "Thiết kế giao diện người dùng chuyên nghiệp với Figma, từ wireframe đến design system hoàn chỉnh.",
    lessons: 5,
    duration: "20h",
  },
];

export function getCourseBySlug(slug: string) {
  return fakeCourses.find((course) => course.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
