import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/pages/landing/reveal";
import { Button } from "@/components/ui/button";

export function LandingCta() {
  return (
    <section id="cta" className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-16">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
              alt="مصافحة بين شخصين ترمز إلى الثقة والشراكة"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
            <div aria-hidden className="bg-grid-pattern-light pointer-events-none absolute inset-0 opacity-40" />
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute -top-16 start-10 h-56 w-56 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-20 end-10 h-56 w-56 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
                ابدأ رحلة العطاء مع جود اليوم
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-primary-foreground/85 sm:text-base">
                انضم إلى شبكة متنامية من الجمعيات والمؤسسات والمتبرعين، وابنِ أثرًا
                حقيقيًا بثقة وشفافية.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">
                    سجّل منظمتك الآن
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
