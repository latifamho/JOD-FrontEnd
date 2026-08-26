"use client";

import * as React from "react";
import Link from "next/link";
import { EllipsisVertical, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type TableRowAction = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
  hidden?: boolean;
};

type TableRowActionsProps = {
  actions: TableRowAction[];
  disabled?: boolean;
  loading?: boolean;
  align?: "start" | "end" | "center";
  triggerLabel?: string;
  className?: string;
};

export function TableRowActions({
  actions,
  disabled = false,
  loading = false,
  align = "end",
  triggerLabel = "الإجراءات",
  className,
}: TableRowActionsProps) {
  const visibleActions = actions.filter((action) => !action.hidden);

  if (visibleActions.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled || loading}
          className={cn("size-8 shadow-sm", className)}
          aria-label={triggerLabel}
          title={triggerLabel}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <EllipsisVertical className="size-4 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="min-w-44 text-right"
        sideOffset={6}
      >
        {visibleActions.map((action) => (
          <React.Fragment key={action.id}>
            {action.separatorBefore ? <DropdownMenuSeparator /> : null}
            {action.href ? (
              <DropdownMenuItem
                asChild
                disabled={action.disabled || disabled || loading}
                className={cn(
                  "cursor-pointer",
                  action.destructive && "text-destructive focus:text-destructive",
                )}
              >
                <Link href={action.href}>
                  {action.icon}
                  {action.label}
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                disabled={action.disabled || disabled || loading}
                className={cn(
                  "cursor-pointer",
                  action.destructive && "text-destructive focus:text-destructive",
                )}
                onSelect={() => action.onSelect?.()}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
