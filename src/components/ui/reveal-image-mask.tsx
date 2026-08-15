"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useWillChange,
} from "framer-motion";

import { cn } from "@/lib/utils";

export interface RevealImageMaskProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  title?: string;
  caption?: string;
  shape?: "circle" | "rounded";
}

export const RevealImageMask = React.forwardRef<HTMLDivElement, RevealImageMaskProps>(
  function RevealImageMask(
    {
      className,
      src = "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
      alt = "ضوء دافئ يتسلل إلى مساحة داخلية",
      title = "الصور تصل بحضورها الخاص",
      caption = "قناع ينفتح من شكل بسيط إلى إطار تحريري كامل مع تقدّم الصفحة.",
      shape = "circle",
      ...props
    },
    ref,
  ) {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const willChange = useWillChange();
    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ["start 85%", "end 15%"],
    });
    const progress = useSpring(scrollYProgress, {
      stiffness: 170,
      damping: 24,
      mass: 0.95,
    });
    const radius = useTransform(
      progress,
      [0, 1],
      shape === "circle" ? ["16%", "75%"] : ["10%", "0%"],
    );
    const inset = useTransform(progress, [0, 1], ["30%", "0%"]);
    const circleClip = useTransform(radius, (latest) => `circle(${latest} at 50% 50%)`);
    const roundedClip = useTransform(
      [radius, inset],
      ([latestRadius, latestInset]) => `inset(${latestInset} round ${latestRadius})`,
    );

    return (
      <div
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("rounded-[2.5rem]  p-4 md:p-6", className)}
        {...props}
      >
        <div className="mb-6 space-y-3 px-2">
          <p className="text-xs font-semibold tracking-[0.3em] text-primary/70 uppercase">
            قصة بصرية
          </p>
          <h3 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {title}
          </h3>
          {caption && (
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{caption}</p>
          )}
        </div>
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  clipPath: shape === "circle" ? circleClip : roundedClip,
                  willChange,
                }
          }
          className="aspect-[16/10] overflow-hidden rounded-[2rem]"
        >
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        </motion.div>
      </div>
    );
  },
);
