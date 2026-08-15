import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AnimatedCounter } from "@/components/pages/landing/animated-counter";
import { Reveal } from "@/components/pages/landing/reveal";
import { Button } from "@/components/ui/button";

const HERO_STATS = [
  { value: 120, suffix: "+", label: "منظمة خيرية موثقة" },
  { value: 340, suffix: "+", label: "حملة تبرع نشطة" },
  { value: 25000, suffix: "+", label: "متبرع في المنصة" },
] as const;

const DONOR_AVATARS = ["أ", "س", "م", "ر"] as const;

export function LandingHero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid-pattern absolute inset-0" />
        <div className="animate-float absolute -top-24 start-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="animate-float [animation-delay:-3s] absolute top-1/3 end-0 h-72 w-72 rounded-full bg-secondary-50 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-4 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        {/* Text column */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-right">
          <span className="animate-in fade-in slide-in-from-bottom-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary duration-700">
            <Sparkles className="size-3.5" />
            منصة رقمية للعمل الخيري المؤسسي
          </span>

          <h1 className="animate-in fade-in slide-in-from-bottom-6 [animation-delay:100ms] mt-6 max-w-xl text-4xl font-bold leading-tight text-foreground duration-700 sm:text-5xl lg:text-6xl">
            جود.. حيث يلتقي{" "}
            <span className="bg-gradient-to-l from-primary to-primary-400 bg-clip-text text-transparent">
              الخير
            </span>{" "}
            بمن يستحقه
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-6 [animation-delay:200ms] mt-6 max-w-xl text-base leading-8 text-muted-foreground duration-700 sm:text-lg">
            منصة موثوقة تربط الجمعيات والمؤسسات الخيرية بالمتبرعين، وتُدير الحملات
            والاعتمادات والتقارير بشفافية كاملة، من لحظة التسجيل حتى وصول الأثر.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-6 [animation-delay:300ms] mt-8 flex flex-col gap-3 duration-700 sm:flex-row">
            <Button size="lg" className="shadow-lg shadow-primary/20" asChild>
              <Link href="/register">
                سجّل منظمتك الآن
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          </div>

          <div className="animate-in fade-in [animation-delay:400ms] mt-6 flex items-center gap-2 text-xs text-muted-foreground duration-700">
            <ShieldCheck className="size-4 text-primary" />
            مراجعة واعتماد رسمي لكل منظمة قبل إطلاق حملاتها
          </div>
        </div>

        {/* Visual mockup column */}
        <Reveal delayMs={200} className="relative mx-auto w-full max-w-md">
          <div className="relative rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                حملة نشطة
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                12 يوم متبقي
              </span>
            </div>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              حملة كسوة الشتاء
            </h3>
            <p className="text-xs text-muted-foreground">جمعية نبض الخير</p>

            <div className="mt-5">
              <div className="flex items-end justify-between text-sm">
                <span className="font-bold text-primary">72%</span>
                <span className="text-xs text-muted-foreground">
                  36,000 / 50,000 ل.س
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="animate-in slide-in-from-right h-full w-[72%] rounded-full bg-gradient-to-l from-primary to-primary-400 duration-1000" />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
              <div className="flex -space-x-2 space-x-reverse">
                {DONOR_AVATARS.map((letter) => (
                  <span
                    key={letter}
                    className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-primary/15 text-xs font-semibold text-primary"
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                و 245 متبرعًا آخرين
              </span>
            </div>
          </div>

          {/* Floating badge — verified */}
          <div className="animate-float absolute -top-6 -start-6 hidden items-center gap-2 rounded-2xl border border-border/60 bg-card px-3.5 py-2.5 shadow-lg sm:flex">
            <BadgeCheck className="size-5 text-primary" />
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground">منظمة موثقة</p>
              <p className="text-[10px] text-muted-foreground">معتمدة من جود</p>
            </div>
          </div>

          {/* Floating badge — growth */}
          <div className="animate-float-delayed absolute -bottom-6 -end-4 hidden items-center gap-2 rounded-2xl border border-border/60 bg-card px-3.5 py-2.5 shadow-lg sm:flex">
            <TrendingUp className="size-5 text-emerald-600" />
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground">+25,000</p>
              <p className="text-[10px] text-muted-foreground">متبرع نشط</p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-5xl border-t border-border/60 px-4 pb-20 pt-10 lg:px-8">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-bold text-primary">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </dd>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
