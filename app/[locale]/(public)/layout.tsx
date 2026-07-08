//app/[locale]/(public)/layout.tsx

import type { ReactNode } from "react";

import { HeaderNavbar } from "@/components/header/header-navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderNavbar />
      <main>{children}</main>
    </>
  );
}
