export type Course = {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  slug: string;
  students: number;
  description: string;
  lessons: number;
};

export const fakeCourses: Course[] = [
  {
    id: "course1",
    title: "React & Next.js Masterclass 2026",
    thumbnail:
      "https://images.pexels.com/photos/374559/pexels-photo-374559.jpeg",
    price: 499000,
    slug: "react-nextjs-masterclass-2026",
    students: 1245,
    description:
      "Xây dựng ứng dụng web hiện đại với React 19, Next.js App Router, Server Components và các pattern production-ready.",
    lessons: 6,
  },
  {
    id: "course2",
    title: "Node.js & Express Backend Development",
    thumbnail:
      "https://images.pexels.com/photos/907489/pexels-photo-907489.jpeg",
    price: 399000,
    slug: "nodejs-express-backend-dev",
    students: 987,
    description:
      "Thiết kế REST API, xử lý authentication, kết nối database và triển khai backend với Node.js và Express.",
    lessons: 5,
  },
  {
    id: "course3",
    title: "TypeScript từ cơ bản đến nâng cao",
    thumbnail:
      "https://images.pexels.com/photos/4578665/pexels-photo-4578665.jpeg",
    price: 299000,
    slug: "typescript-co-ban-den-nang-cao",
    students: 1562,
    description:
      "Làm chủ TypeScript từ kiểu dữ liệu cơ bản đến generics, utility types và tích hợp vào dự án React/Node.",
    lessons: 5,
  },
  {
    id: "course4",
    title: "UI/UX Design with Figma",
    thumbnail:
      "https://images.pexels.com/photos/247791/pexels-photo-247791.png",
    price: 349000,
    slug: "ui-ux-design-figma",
    students: 723,
    description:
      "Thiết kế giao diện người dùng chuyên nghiệp với Figma, từ wireframe đến design system hoàn chỉnh.",
    lessons: 5,
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
