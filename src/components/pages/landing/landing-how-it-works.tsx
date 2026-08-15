import { ClipboardCheck, FileCheck2, Megaphone, TrendingUp } from "lucide-react";

import { Reveal } from "@/components/pages/landing/reveal";

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "سجّل منظمتك",
    description:
      "أنشئ حساب منظمتك وأدخل بياناتها الرسمية وأوراق الترخيص في خطوتين بسيطتين.",
  },
  {
    icon: FileCheck2,
    title: "المراجعة والاعتماد",
    description:
      "يراجع فريق جود بياناتك للتأكد من مطابقتها، ثم يفعّل حسابك خلال وقت قصير.",
  },
  {
    icon: Megaphone,
    title: "أطلق حملتك",
    description:
      "أنشئ حملات التبرع، حدد أهدافها الزمنية والمالية، وشاركها مع المتبرعين.",
  },
  {
    icon: TrendingUp,
    title: "تابع الأثر",
    description:
      "راقب التبرعات والتقارير لحظة بلحظة، وشارك التحديثات مع داعمي منظمتك.",
  },
] as const;

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">كيف تعمل المنصة</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            رحلة بسيطة من التسجيل إلى الأثر
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delayMs={index * 120}>
              <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                <span className="absolute -top-3 -start-3 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
                  {index + 1}
                </span>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="size-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
