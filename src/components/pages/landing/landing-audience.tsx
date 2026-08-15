import Link from "next/link";
import { ArrowLeft, Building2, HeartHandshake, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/pages/landing/reveal";
import { RevealMask } from "@/components/pages/landing/reveal-mask";
import { Button } from "@/components/ui/button";

const AUDIENCES = [
  {
    icon: Building2,
    title: "الجمعيات والمؤسسات",
    description: "سجّل منظمتك، أدر حملاتك، وتابع تبرعاتك بشفافية أمام داعميك.",
    cta: { label: "سجّل منظمتك", href: "/register" },
  },
  {
    icon: HeartHandshake,
    title: "المتبرعون",
    description: "اكتشف حملات موثقة، وتابع أثر تبرعك من لحظة الدعم حتى التنفيذ.",
    cta: { label: "تصفح الحملات", href: "/login" },
  },
  {
    icon: ShieldCheck,
    title: "فريق المراجعة والإدارة",
    description: "راجع بيانات المنظمات والحملات، واعتمدها وفق معايير جود.",
    cta: { label: "تسجيل الدخول", href: "/login" },
  },
] as const;

export function LandingAudience() {
  return (
    <section id="audience" className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">لمن جود؟</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            مصممة لكل أطراف العمل الخيري
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {AUDIENCES.map((audience, index) => (
            <Reveal key={audience.title} delayMs={index * 150}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                <RevealMask delay={index * 0.1} className="h-32">
                  <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-primary/25 via-primary/10 to-transparent">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-card text-primary shadow-md ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-110">
                      <audience.icon className="size-7" />
                    </div>
                  </div>
                </RevealMask>

                <div className="flex flex-col items-center gap-3 p-8 pt-6 text-center">
                  <h3 className="text-lg font-semibold text-foreground">{audience.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {audience.description}
                  </p>
                  <Button variant="outline" className="group/btn mt-2" asChild>
                    <Link href={audience.cta.href}>
                      {audience.cta.label}
                      <ArrowLeft className="size-4 transition-transform duration-300 group-hover/btn:-translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
