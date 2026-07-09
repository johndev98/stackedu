"use client";

import { LOCALES } from "@/constants/locales";

import { Icon } from "@iconify/react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = LOCALES.find((item) => item.code === locale);

  const routeParams = Object.fromEntries(
    Object.entries(params).filter(([key]) => key !== "locale"),
  );

  const switchLocale = (nextLocale: string) => {
    router.replace(
      // @ts-expect-error -- pathname and params always match the current route
      Object.keys(routeParams).length > 0
        ? { pathname, params: routeParams }
        : { pathname },
      { locale: nextLocale },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none focus:outline-none">
          <Icon
            icon={currentLocale?.icon ?? "circle-flags:us"}
            className="h-5 w-5"
          />

          {locale.toUpperCase()}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {LOCALES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() => switchLocale(item.code)}
          >
            <Icon icon={item.icon} className="mr-2 h-5 w-5" />

            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
