import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  MessageCircleHeart,
  GraduationCap,
} from "lucide-react";
import type { LEARN_SIDEBAR_LABELS } from "@/constants/learn-copy";

export type LearnRoute =
  | "/learn"
  | "/learn/my-courses"
  | "/learn/community";

export type LearnNavItem = {
  key: keyof typeof LEARN_SIDEBAR_LABELS;
  href: LearnRoute;
  icon: LucideIcon;
};

export const LEARN_MENU: LearnNavItem[] = [
  { key: "dashboard", href: "/learn", icon: LayoutDashboard },
  { key: "my-courses", href: "/learn/my-courses", icon: GraduationCap },
  { key: "community", href: "/learn/community", icon: MessageCircleHeart },
];
