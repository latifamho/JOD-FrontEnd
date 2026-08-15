"use client";

import * as React from "react";

type AnimatedCounterProps = {
  readonly value: number;
  readonly suffix?: string;
  readonly durationMs?: number;
};

export function AnimatedCounter({
  value,
  suffix = "",
  durationMs = 1500,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(0);
  const [hasStarted, setHasStarted] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!hasStarted) return;

    const startTime = performance.now();
    let frameId: number;

    function tick(now: number) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * value));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [hasStarted, value, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("ar")}
      {suffix}
    </span>
  );
}
