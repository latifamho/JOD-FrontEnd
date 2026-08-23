import { Download, Sparkles } from "lucide-react";

import { AnimatedCounter } from "@/components/pages/landing/animated-counter";
import { Button } from "@/components/ui/button";

const HERO_STATS = [
  { value: 120, suffix: "+", label: "منظمة خيرية موثقة" },
  { value: 340, suffix: "+", label: "حملة تبرع نشطة" },
  { value: 25000, suffix: "+", label: "متبرع في المنصة" },
] as const;

const APP_DOWNLOAD_URL = process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL?.trim() || "#download-app";

export function LandingHero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid-pattern absolute inset-0" />
        <div className="animate-float absolute -top-24 start-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="animate-float [animation-delay:-3s] absolute top-1/3 end-0 h-72 w-72 rounded-full bg-secondary-50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="animate-in fade-in slide-in-from-bottom-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary duration-700">
            <Sparkles className="size-3.5" />
            منصة رقمية للعمل الخيري المؤسسي
          </span>

          <h1 className="animate-in fade-in slide-in-from-bottom-6 [animation-delay:100ms] mt-6 max-w-3xl text-4xl font-bold leading-tight text-foreground duration-700 sm:text-5xl lg:text-6xl">
            جود.. حيث يلتقي{" "}
            <span className="bg-gradient-to-l from-primary to-primary-400 bg-clip-text text-transparent">
              الخير
            </span>{" "}
            بمن يستحقه
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-6 [animation-delay:200ms] mt-6 max-w-2xl text-base leading-8 text-muted-foreground duration-700 sm:text-lg">
            منصة موثوقة تربط الجمعيات والمؤسسات الخيرية بالمتبرعين، وتُدير الحملات
            والاعتمادات والتقارير بشفافية كاملة، من لحظة التسجيل حتى وصول الأثر.
          </p>

          <div
            id="download-app"
            className="animate-in fade-in slide-in-from-bottom-6 [animation-delay:300ms] mt-8 duration-700"
          >
            <Button size="lg" className="min-w-44 shadow-lg shadow-primary/20" asChild>
              <a href={APP_DOWNLOAD_URL}>
                تحميل التطبيق
                <Download className="size-4" />
              </a>
            </Button>
          </div>
        </div>
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
