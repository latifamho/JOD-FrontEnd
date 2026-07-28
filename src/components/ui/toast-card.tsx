"use client";

import { CheckCircle2, CircleX, Info, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ToastRequest, ToastType } from "@/types/toast.types";

const toastTypeConfig: Record<
  ToastType,
  {
    title: string;
    icon: typeof CheckCircle2;
    borderClass: string;
    iconClass: string;
  }
> = {
  success: {
    title: "تم بنجاح",
    icon: CheckCircle2,
    borderClass: "border-success/35",
    iconClass: "bg-success/10 text-success",
  },
  error: {
    title: "حدث خطأ",
    icon: CircleX,
    borderClass: "border-destructive/35",
    iconClass: "bg-destructive/10 text-destructive",
  },
  warning: {
    title: "تنبيه",
    icon: TriangleAlert,
    borderClass: "border-warning/40",
    iconClass: "bg-warning/10 text-warning",
  },
  info: {
    title: "معلومة",
    icon: Info,
    borderClass: "border-info/40",
    iconClass: "bg-info/10 text-info",
  },
};

type ToastCardProps = {
  toast: ToastRequest & {
    duration: number;
    dismissible: boolean;
  };
  onDismiss: (id: string) => void;
};

export function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const config = toastTypeConfig[toast.type];
  const Icon = config.icon;
  const isAssertive = toast.type === "error" || toast.type === "warning";

  return (
    <div
      role={isAssertive ? "alert" : "status"}
      dir="rtl"
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-xl border bg-card p-3 text-card-foreground shadow-lg",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        config.borderClass,
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
          config.iconClass,
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 text-right">
        <p className="text-sm font-semibold text-foreground">
          {toast.title ?? config.title}
        </p>
        <p className="mt-0.5 break-words text-xs leading-5 text-muted-foreground">
          {toast.message}
        </p>
      </div>

      {toast.dismissible ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => onDismiss(toast.id)}
          aria-label="إغلاق الإشعار"
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
