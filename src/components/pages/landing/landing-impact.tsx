"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

import { AnimatedCounter } from "@/components/pages/landing/animated-counter";
import { Reveal } from "@/components/pages/landing/reveal";

const IMPACT_STATS = [
  { value: 12400, suffix: "+", label: "مستفيد من الحملات الموثقة" },
  { value: 340, suffix: "+", label: "حملة أُنجزت بنجاح" },
  { value: 98, suffix: "٪", label: "نسبة الشفافية في التقارير" },
] as const;

const CURTAIN_TRANSITION = {
  duration: 0.9,
  delay: 0.15,
  ease: [0.76, 0, 0.24, 1] as const,
};

export function LandingImpact() {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, amount: 0.4 });

  return (
    <section id="impact" className="overflow-hidden py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <Reveal className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" />
            قصة الأثر
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            من كل تبرع... أثرٌ يصل لمن يستحقه
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
            كل ليرة تمر عبر جود موثّقة من لحظة التبرع حتى تنفيذ الحملة، بتقارير
            شفافة تصل للمتبرع وتُبقي المنظمة والداعم على تواصل دائم بالأثر
            الحقيقي على الأرض.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-border/60 pt-8 sm:grid-cols-3">
            {IMPACT_STATS.map((stat, index) => (
              <Reveal
                key={stat.label}
                delayMs={index * 120}
                className="flex flex-col gap-1"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-bold text-primary">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </dd>
                <span className="text-sm leading-6 text-muted-foreground">
                  {stat.label}
                </span>
              </Reveal>
            ))}
          </dl>
        </Reveal>

        <div ref={panelRef} className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-border/60 shadow-xl sm:aspect-[16/11] lg:aspect-[4/5]">
            <motion.div
              initial={{ scale: 1.15, opacity: 0.6 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80"
                alt="يدان تتلامسان بامتداد بين شخصين"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-dark-300/50 to-primary/40" />

              <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                  <HeartHandshake className="size-12 text-primary-foreground" />
                </div>
                <p className="max-w-[220px] text-sm leading-7 text-primary-foreground/85">
                  &ldquo;وصلت مساعدتك لأكثر من ١٢ ألف مستفيد هذا العام&rdquo;
                </p>
              </div>

              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-black/30 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-2 text-primary-foreground">
                  <ShieldCheck className="size-4" />
                  <span className="text-xs font-semibold">أثر موثّق لحظة بلحظة</span>
                </div>
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: "0%" }}
              animate={isInView ? { x: "-100%" } : { x: "0%" }}
              transition={CURTAIN_TRANSITION}
              className="absolute inset-y-0 left-0 z-10 w-1/2 bg-background"
            />
            <motion.div
              initial={{ x: "0%" }}
              animate={isInView ? { x: "100%" } : { x: "0%" }}
              transition={CURTAIN_TRANSITION}
              className="absolute inset-y-0 right-0 z-10 w-1/2 bg-background"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
