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
    "/learn/my-courses": {
      en: "/learn/my-courses",
      vi: "/hoc/khoa-hoc",
    },
    "/learn/my-courses/[slug]": {
      en: "/learn/my-courses/[slug]",
      vi: "/hoc/khoa-hoc/[slug]",
    },
    "/learn/community": {
      en: "/learn/community",
      vi: "/hoc/cong-dong",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathnames = keyof typeof routing.pathnames;

type PathnameHasParam<T extends string> = T extends `${string}[${string}`
  ? T
  : never;

export type DynamicAppPathnames = PathnameHasParam<AppPathnames>;
export type StaticAppPathnames = Exclude<AppPathnames, DynamicAppPathnames>;
