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
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathnames = keyof typeof routing.pathnames;

type PathnameHasParam<T extends string> = T extends `${string}[${string}`
  ? T
  : never;

export type DynamicAppPathnames = PathnameHasParam<AppPathnames>;
export type StaticAppPathnames = Exclude<AppPathnames, DynamicAppPathnames>;
