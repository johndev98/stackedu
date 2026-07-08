import { House, FolderGit2, BookOpen, UserRound } from "lucide-react";
import { ROUTES } from "./routes";

export const NAV_ITEMS = [
  {
    key: "home",
    href: ROUTES.HOME,
    icon: House,
  },
  {
    key: "courses",
    href: ROUTES.COURSES,
    icon: UserRound,
  },
  {
    key: "blog",
    href: ROUTES.BLOG,
    icon: BookOpen,
  },
];