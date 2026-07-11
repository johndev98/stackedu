export type Course = {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  slug: string;
  students: number;
  description: string;
  lessons: number;
  maxOnline: number; // ✅ Thêm trường này: số người học tối đa ban ngày
};

export const fakeCourses: Course[] = [
  {
    id: "course1",
    title: "React & Next.js Masterclass 2026",
    thumbnail:
      "https://images.pexels.com/photos/374559/pexels-photo-374559.jpeg",
    price: 499000,
    slug: "react-nextjs-masterclass-2026",
    students: 23,
    description:
      "Xây dựng ứng dụng web hiện đại với React 19, Next.js App Router...",
    lessons: 6,
    maxOnline: 20, // ✅ Ban ngày dao động quanh 45 người
  },
  {
    id: "course2",
    title: "Node.js & Express Backend Development",
    thumbnail:
      "https://images.pexels.com/photos/907489/pexels-photo-907489.jpeg",
    price: 399000,
    slug: "nodejs-express-backend-dev",
    students: 71,
    description: "Thiết kế REST API, xử lý authentication, kết nối database...",
    lessons: 5,
    maxOnline: 40,
  },
  {
    id: "course3",
    title: "TypeScript từ cơ bản đến nâng cao",
    thumbnail:
      "https://images.pexels.com/photos/4578665/pexels-photo-4578665.jpeg",
    price: 299000,
    slug: "typescript-co-ban-den-nang-cao",
    students: 65,
    description: "Làm chủ TypeScript từ kiểu dữ liệu cơ bản đến generics...",
    lessons: 5,
    maxOnline: 35,
  },
  {
    id: "course4",
    title: "UI/UX Design with Figma",
    thumbnail:
      "https://images.pexels.com/photos/247791/pexels-photo-247791.png",
    price: 349000,
    slug: "ui-ux-design-figma",
    students: 54,
    description: "Thiết kế giao diện người dùng chuyên nghiệp với Figma...",
    lessons: 5,
    maxOnline: 40,
  },
  {
    id: "course5",
    title: "Giới thiệu Lập trình Web cho Người mới bắt đầu",
    thumbnail:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
    price: 0,
    slug: "gioi-thieu-lap-trinh-web-mien-phi",
    students: 203,
    description: "Khóa học cơ bản 100% miễn phí, làm quen HTML, CSS, JS...",
    lessons: 8,
    maxOnline: 80, // ✅ Khóa miễn phí đông hơn
  },
];

// Giữ nguyên hàm formatPrice và getCourseBySlug
export function getCourseBySlug(slug: string) {
  return fakeCourses.find((course) => course.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
