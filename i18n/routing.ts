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
  },
});
