import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stack Edu",
  description: "Stack Edu là nền tảng học tập miễn phí",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={cn("h-full antialiased", geistSans.variable, geistMono.variable, inter.variable, "font-sans", )}
    >
      {/* ✅ BODY BÂY GIỜ TRONG SUỐT, KHÔNG MÀU NỀN CỨNG NỮA */}
      {/* Mỗi layout con sẽ tự quyết định màu nền của chính nó */}
      <body className="h-full bg-transparent">
        <NextIntlClientProvider messages={messages}>
          {children} {/* ✅ ĐƯA THẲNG ĐI, KHÔNG BỌC GÌ THÊM */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
