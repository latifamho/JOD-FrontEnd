"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealMaskProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly delay?: number;
};

export function RevealMask({ children, className, delay = 0 }: RevealMaskProps) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0 0)" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
