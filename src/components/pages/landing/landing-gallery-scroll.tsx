"use client";

import * as React from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import {
  Baby,
  Droplets,
  GraduationCap,
  HandCoins,
  Heart,
  Home,
  ShieldPlus,
  Wheat,
} from "lucide-react";

const CATEGORIES = [
  { icon: GraduationCap, label: "التعليم" },
  { icon: ShieldPlus, label: "الصحة" },
  { icon: Heart, label: "الإغاثة العاجلة" },
  { icon: Baby, label: "رعاية الأيتام" },
  { icon: Wheat, label: "الأمن الغذائي" },
  { icon: Home, label: "الإسكان" },
  { icon: Droplets, label: "المياه والنظافة" },
  { icon: HandCoins, label: "التمكين الاقتصادي" },
] as const;

const COLUMNS = [
  CATEGORIES.slice(0, 2),
  CATEGORIES.slice(2, 4),
  CATEGORIES.slice(4, 6),
  CATEGORIES.slice(6, 8),
] as const;

const COLUMN_OFFSETS: ReadonlyArray<[number, number]> = [
  [-150, 40],
  [90, -120],
  [-120, 90],
  [40, -150],
];

type CategoryItem = (typeof CATEGORIES)[number];

function GalleryColumn({
  items,
  offset,
  progress,
}: {
  readonly items: readonly CategoryItem[];
  readonly offset: [number, number];
  readonly progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 1], offset);

  return (
    <motion.div style={{ y }} className="flex flex-col gap-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 via-card to-card p-4 text-center shadow-sm transition-colors hover:border-primary/40"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <item.icon className="size-5" />
          </div>
          <span className="text-sm font-semibold text-foreground">{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

export function LandingGalleryScroll() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1.3, 0.85]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.1]);
  const galleryOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);
  const galleryScale = useTransform(scrollYProgress, [0, 0.22], [0.9, 1]);

  return (
    <section ref={containerRef} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div aria-hidden className="bg-grid-pattern pointer-events-none absolute inset-0 -z-10" />

        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity }}
          className="pointer-events-none absolute z-10 px-4 text-center"
        >
          <span className="text-sm font-semibold text-primary">قطاعات الأثر</span>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold text-foreground sm:text-5xl">
            نصنع الأثر في كل مجالات العمل الإنساني
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: galleryOpacity, scale: galleryScale }}
          className="grid w-full max-w-7xl grid-cols-2 gap-5 px-6 sm:grid-cols-4 lg:px-8"
        >
          {COLUMNS.map((columnItems, index) => (
            <GalleryColumn
              key={columnItems[0].label}
              items={columnItems}
              offset={COLUMN_OFFSETS[index]}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
