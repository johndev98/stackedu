import type { LucideIcon } from "lucide-react";
import type { AppPathnames } from "@/i18n/routing";
import {
  LayoutDashboard,
  MessageCircleHeart,
  GraduationCap,
} from "lucide-react";

export type LearnNavItem = {
  key: string;
  href: AppPathnames;
  icon: LucideIcon;
};

export const LEARN_MENU: LearnNavItem[] = [
  { key: "dashboard", href: "/learn", icon: LayoutDashboard },
  { key: "my-courses", href: "/learn/my-courses", icon: GraduationCap },
  { key: "community", href: "/learn/community", icon: MessageCircleHeart },
];
