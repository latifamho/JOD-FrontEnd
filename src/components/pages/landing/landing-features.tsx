import {
  BarChart3,
  HeartHandshake,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

import { Reveal } from "@/components/pages/landing/reveal";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "شفافية كاملة",
    description:
      "كل تبرع وحملة موثقة ومتاحة للمراجعة، من الاعتماد حتى صرف الأثر — بلا غموض وبلا وسطاء.",
    span: "lg:col-span-2 lg:row-span-2",
    featured: true,
  },
  {
    icon: LayoutDashboard,
    title: "لوحات تحكم مخصصة",
    description: "لوحة لكل دور: الإدارة، مالك المنظمة، وفريق العمل — بصلاحيات دقيقة.",
    span: "lg:col-span-1",
    featured: false,
  },
  {
    icon: BarChart3,
    title: "تقارير وتحليلات",
    description: "تابع أداء حملاتك وتبرعاتك بمؤشرات ورسوم بيانية لحظية.",
    span: "lg:col-span-1",
    featured: false,
  },
  {
    icon: Wallet,
    title: "إدارة تبرعات سلسة",
    description: "استقبل التبرعات وتتبعها لكل حملة بسهولة وأمان.",
    span: "lg:col-span-1",
    featured: false,
  },
  {
    icon: Users,
    title: "إدارة المتبرعين",
    description: "بيانات موحّدة للمتبرعين وسجل تبرعاتهم مع كل منظمة.",
    span: "lg:col-span-1",
    featured: false,
  },
  {
    icon: HeartHandshake,
    title: "دعم المبادرات المجتمعية",
    description: "مساحة لجمعيات ومؤسسات ومبادرات لإطلاق أثرها الإنساني.",
    span: "lg:col-span-2",
    featured: false,
  },
] as const;

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">المميزات</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            كل ما تحتاجه منظمتك في مكان واحد
          </h2>
        </Reveal>

        <div className="mt-16 grid auto-rows-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Reveal
              key={feature.title}
              delayMs={(index % 4) * 100}
              className={cn(feature.span)}
            >
              <div
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg",
                  feature.featured
                    ? "justify-between bg-gradient-to-br from-primary/10 via-card to-card"
                    : "bg-card",
                )}
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="size-6" />
                  </div>
                  <h3
                    className={cn(
                      "mt-4 font-semibold text-foreground",
                      feature.featured ? "text-xl" : "text-base",
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 leading-6 text-muted-foreground",
                      feature.featured ? "text-sm sm:text-base" : "text-sm",
                    )}
                  >
                    {feature.description}
                  </p>
                </div>

                {feature.featured && (
                  <div aria-hidden className="mt-8 flex items-end gap-2">
                    {[40, 65, 45, 85, 60, 95].map((height, barIndex) => (
                      <div
                        key={height}
                        className="flex-1 rounded-t-md bg-primary/20 transition-all duration-500 group-hover:bg-primary/40"
                        style={{
                          height: `${height}px`,
                          transitionDelay: `${barIndex * 60}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
