import type { ReactNode } from "react";
import Image from "next/image";

import authImage from "@/assets/images/jod-auth.png";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="fixed inset-0 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(64,93,114,0.18),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(159,174,184,0.26),transparent_42%)]">
      <div
        dir="ltr"
        className="grid h-full min-h-0 w-full md:grid-cols-[1fr_1fr] md:overflow-hidden"
      >
        <aside className="relative min-h-65 overflow-hidden md:min-h-full md:rounded-r-3xl rounded-r-none">
          <Image
            src={authImage}
            alt="منصة جود"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary/80 via-primary/60 to-slate-900/60" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
            <div className="mx-auto flex max-w-lg flex-col items-center text-center lg:ml-auto lg:mr-0 lg:items-end">
              <p className="text-xs text-white/85 md:text-sm">منصة جود</p>
              <h1 className="mt-1 text-2xl font-semibold md:text-3xl">
                ادعم الخير بأثرٍ مستدام
              </h1>
              <p className="mt-2 text-xs text-white/85 md:text-sm">
                منصة موحدة لإدارة المبادرات والمنظمات الإنسانية بكفاءة ووضوح
              </p>
            </div>
          </div>
        </aside>

        <section
          dir="rtl"
          className="flex min-h-0 items-center justify-center overflow-hidden bg-card px-5 py-8 md:items-stretch md:px-10 md:py-10"
        >
          {children}
        </section>
      </div>
    </main>
  );
}
