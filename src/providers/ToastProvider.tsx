"use client";

import * as React from "react";

import { ToastCard } from "@/components/ui/toast-card";
import { toast, subscribeToToasts } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type {
  ToastApi,
  ToastPosition,
  ToastRequest,
} from "@/types/toast.types";

type RenderedToast = ToastRequest & {
  position: ToastPosition;
  duration: number;
  dismissible: boolean;
};

type ToastProviderProps = {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
  maxVisible?: number;
};

const ToastContext = React.createContext<ToastApi | null>(null);

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const positionClassNames: Record<ToastPosition, string> = {
  "top-left": "left-4 top-4 items-start",
  "top-center": "left-1/2 top-4 -translate-x-1/2 items-center",
  "top-right": "right-4 top-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
};

export function ToastProvider({
  children,
  defaultPosition = "top-left",
  defaultDuration = 4500,
  maxVisible = 4,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<RenderedToast[]>([]);
  const timers = React.useRef(new Map<string, number>());

  const dismiss = React.useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  React.useEffect(() => {
    const unsubscribe = subscribeToToasts((event) => {
      if (event.type === "dismiss") {
        dismiss(event.id);
        return;
      }

      if (event.type === "clear") {
        setToasts((current) => {
          const removed = event.position
            ? current.filter((item) => item.position === event.position)
            : current;
          removed.forEach((item) => {
            const timer = timers.current.get(item.id);
            if (timer !== undefined) window.clearTimeout(timer);
            timers.current.delete(item.id);
          });
          return event.position
            ? current.filter((item) => item.position !== event.position)
            : [];
        });
        return;
      }

      const nextToast: RenderedToast = {
        ...event.toast,
        position: event.toast.position ?? defaultPosition,
        duration: event.toast.duration ?? defaultDuration,
        dismissible: event.toast.dismissible ?? true,
      };

      setToasts((current) => {
        const samePosition = current.filter(
          (item) => item.position === nextToast.position,
        );
        const overflowCount = Math.max(0, samePosition.length - maxVisible + 1);
        const overflowIds = new Set(
          samePosition.slice(0, overflowCount).map((item) => item.id),
        );

        overflowIds.forEach((id) => {
          const timer = timers.current.get(id);
          if (timer !== undefined) window.clearTimeout(timer);
          timers.current.delete(id);
        });

        return [...current.filter((item) => !overflowIds.has(item.id)), nextToast];
      });

      if (nextToast.duration > 0) {
        const timer = window.setTimeout(
          () => dismiss(nextToast.id),
          nextToast.duration,
        );
        timers.current.set(nextToast.id, timer);
      }
    });

    return () => {
      unsubscribe();
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    };
  }, [defaultDuration, defaultPosition, dismiss, maxVisible]);

  const contextValue = React.useMemo<ToastApi>(() => toast, []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {POSITIONS.map((position) => {
        const positionedToasts = toasts.filter(
          (item) => item.position === position,
        );
        if (positionedToasts.length === 0) return null;

        const visibleToasts = position.startsWith("bottom")
          ? [...positionedToasts].reverse()
          : positionedToasts;

        return (
          <div
            key={position}
            aria-live="polite"
            aria-relevant="additions removals"
            className={cn(
              "pointer-events-none fixed z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3",
              positionClassNames[position],
            )}
          >
            {visibleToasts.map((item) => (
              <ToastCard key={item.id} toast={item} onDismiss={dismiss} />
            ))}
          </div>
        );
      })}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
