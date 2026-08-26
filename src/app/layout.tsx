import type { Metadata } from "next"
import { Noto_Kufi_Arabic } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/providers/AuthProvider"
import { QueryProvider } from "@/providers/query-provider"
import { ToastProvider } from "@/providers/ToastProvider"
import { THEME_BOOT_SCRIPT } from "@/lib/theme"
import "./globals.css"

const notoKufiArabic = Noto_Kufi_Arabic({ variable: "--font-noto-kufi-arabic", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], display: "swap" })
export const metadata: Metadata = { title: "منصة جود", description: "منصة جود لدعم المبادرات الإنسانية والمجتمعية" }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className={`${notoKufiArabic.variable} antialiased`}>
        <ToastProvider defaultPosition="top-left">
          <QueryProvider><AuthProvider><TooltipProvider>{children}</TooltipProvider></AuthProvider></QueryProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
