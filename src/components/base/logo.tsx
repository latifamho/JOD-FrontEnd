"use client";

import Image from "next/image";

import logoImage from "@/assets/images/jod-logo.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  imageClassName?: string;
  alt?: string;
  priority?: boolean;
};

export function Logo({
  className,
  imageClassName,
  alt = "شعار منصة جود",
  priority = false,
}: LogoProps) {
  return (
    <span className={cn("flex items-center justify-center", className)}>
      <Image
        src={logoImage}
        alt={alt}
        className={cn("size-20 object-contain", imageClassName)}
        priority={priority}
      />
    </span>
  );
}
