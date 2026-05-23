"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppIcons } from "@/constant/icons";
import { getPathLabel } from "@/constant/routes";
import { cn } from "@/lib/utils";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((_, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = getPathLabel(href);
    return { href, label };
  });

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="breadcrumb"
      className=" bg-background/95 px-4 py-3 backdrop-blur"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              key={breadcrumb.href}
              className="inline-flex items-center gap-2"
            >
              {index > 0 && (
                <AppIcons.chevronLeft className="size-4 text-muted-foreground" />
              )}
              {isLast ? (
                <span className="font-semibold text-primary">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className={cn(
                    "text-muted-foreground transition-colors hover:text-primary-400",
                  )}
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
