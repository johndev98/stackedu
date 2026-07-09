import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "vi"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/courses": {
      en: "/courses",
      vi: "/khoa-hoc",
    },
    "/blog": {
      en: "/blog",
      vi: "/bai-viet",
    },
    "/learn": {
      en: "/learn",
      vi: "/hoc",
    },
    "/learn/my-courses": { en: "/learn/my-courses", vi: "/hoc/khoa-hoc" },
    "/learn/community": { en: "/learn/community", vi: "/hoc/cong-dong" },
  
  },
});
export type Locale = (typeof routing.locales)[number];
// ✅ EXPORT RA KIỂU TẤT CẢ ROUTE ĐỂ DÙNG Ở CONSTANTS
export type AppPathnames = keyof typeof routing.pathnames;