"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

const BACKGROUND_SRC =
  "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1800&q=80";
const CARD_SRC =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80";

export function LandingParallaxStory() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["-28%", "28%"]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const textY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 0.4, 0.55]);

  return (
    <section
      ref={sectionRef}
      id="story-parallax"
      className="relative h-[90vh] min-h-[560px] overflow-hidden bg-dark-300"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-[-8%]">
        <img
          src={BACKGROUND_SRC}
          alt="متطوعون يوزعون صناديق الطعام على المستفيدين"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-dark-300/80 via-dark-300/50 to-dark-300/85"
      />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-200">
          <Sparkles className="size-4" />
          الأثر يتحرك معك
        </span>
        <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-5xl">
          كل خطوة تمرّ بها العطاء، جود توثّقها لك
        </h2>
        <p className="max-w-xl text-sm leading-7 text-white/80 sm:text-base">
          من لحظة التبرع الأولى إلى وصول الأثر لمن يستحقه، طبقات من الشفافية تواكب
          حملتك في كل مرحلة.
        </p>
      </motion.div>

      <motion.div
        style={{ y: cardY, rotate: cardRotate }}
        className="absolute end-6 top-1/2 z-10 hidden w-56 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/15 shadow-2xl sm:block lg:end-16 lg:w-64"
      >
        <img
          src={CARD_SRC}
          alt="يدان تحملان عملات معدنية وورقة مكتوب عليها أحدث فرقًا"
          className="aspect-[4/5] h-full w-full object-cover"
        />
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl bg-black/40 px-3 py-2 backdrop-blur-md">
          <ShieldCheck className="size-3.5 text-primary-200" />
          <span className="text-[11px] font-semibold text-white">تبرع موثّق</span>
        </div>
      </motion.div>
    </section>
  );
}
