"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryDisclosure } from "@/hooks/use-query-modal";

import { Logo } from "@/components/base/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SIDEBAR_TOGGLE_EVENT } from "@/constant/events";
import { AppIcons } from "@/constant/icons";
import {
  getDashboardHomeByRole,
  getRoleFromPath,
  getRoleLinks,
  isRouteActive,
  routePaths,
  type AppNavLink,
} from "@/constant/routes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

const DESKTOP_BREAKPOINT = 1024;
const COLLAPSE_STORAGE_KEY = "jod:sidebar-collapsed";
const SIDEBAR_COLLAPSE_CHANGE_EVENT = "jod:sidebar-collapse-change";

function getCollapsedSnapshot(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const persisted = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);
    // Default: sidebar stays open until the user collapses it.
    return persisted === null ? false : persisted === "true";
  } catch {
    return false;
  }
}

function subscribeToCollapsedChanges(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === COLLAPSE_STORAGE_KEY) callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SIDEBAR_COLLAPSE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SIDEBAR_COLLAPSE_CHANGE_EVENT, callback);
  };
}

function usePersistedCollapsed(): readonly [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const collapsed = React.useSyncExternalStore(
    subscribeToCollapsedChanges,
    getCollapsedSnapshot,
    () => false,
  );

  const setCollapsed = React.useCallback<
    React.Dispatch<React.SetStateAction<boolean>>
  >((nextValue) => {
    if (typeof window === "undefined") return;

    const nextCollapsed =
      typeof nextValue === "function"
        ? nextValue(getCollapsedSnapshot())
        : nextValue;

    try {
      window.localStorage.setItem(
        COLLAPSE_STORAGE_KEY,
        String(nextCollapsed),
      );
    } finally {
      window.dispatchEvent(new Event(SIDEBAR_COLLAPSE_CHANGE_EVENT));
    }
  }, []);

  return [collapsed, setCollapsed] as const;
}

function normalizePathname(pathname: string): string {
  const normalized = pathname.trim().replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
}

const DASHBOARD_ROOT = normalizePathname(routePaths.dashboardScope.root);

type SearchEntry = {
  id: string;
  label: string;
  href: string;
  icon: keyof typeof AppIcons;
  type: "link" | "tab";
  parentLabel?: string;
};

function groupLinksBySection(links: AppNavLink[]) {
  const grouped = new Map<string, AppNavLink[]>();

  links.forEach((link) => {
    const currentGroup = grouped.get(link.section) ?? [];
    grouped.set(link.section, [...currentGroup, link]);
  });

  return Array.from(grouped.entries());
}

function buildSearchIndex(links: AppNavLink[]): SearchEntry[] {
  const entries: SearchEntry[] = [];

  links.forEach((link) => {
    entries.push({
      id: `link-${link.href}`,
      label: link.label,
      href: link.href,
      icon: link.icon,
      type: "link",
    });

    link.tabs?.forEach((tab) => {
      entries.push({
        id: `tab-${tab.href}-${link.href}`,
        label: tab.label,
        href: tab.href,
        icon: tab.icon,
        type: "tab",
        parentLabel: link.label,
      });
    });
  });

  return entries;
}

function findMatchingLinks(
  links: AppNavLink[],
  results: SearchEntry[],
): Array<[string, AppNavLink[]]> {
  const matchedLinkHrefs = new Set(
    results
      .map((result) => {
        if (result.type === "link") {
          return result.href;
        }

        const parentLink = links.find((link) =>
          link.tabs?.some((tab) => tab.href === result.href),
        );
        return parentLink?.href;
      })
      .filter(Boolean),
  );

  const matchedLinks = links.filter((link) => matchedLinkHrefs.has(link.href));
  return groupLinksBySection(matchedLinks);
}

type NavGroupedListProps = {
  pathname: string;
  homeHref: string;
  collapsed: boolean;
  groupedLinks: Array<[string, AppNavLink[]]>;
  onLinkClick?: () => void;
};

function NavGroupedList({
  pathname,
  homeHref,
  collapsed,
  groupedLinks,
  onLinkClick,
}: NavGroupedListProps) {
  return (
    <ul className="space-y-5">
      {groupedLinks.map(([section, sectionLinks]) => (
        <li key={section}>
          {!collapsed && (
            <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              {section}
            </p>
          )}
          <ul className="space-y-2">
            {sectionLinks.map((link) => {
              const Icon = AppIcons[link.icon];
              const isHomeLink =
                normalizePathname(link.href) === normalizePathname(homeHref);
              const isDashboardRoot = normalizePathname(pathname) === DASHBOARD_ROOT;
              const active = isHomeLink
                ? normalizePathname(pathname) === normalizePathname(link.href) ||
                  isDashboardRoot
                : isRouteActive(pathname, link.href) ||
                  link.tabs?.some((tab) => isRouteActive(pathname, tab.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className={cn(
                      "flex h-11 items-center rounded-md px-3 text-sm font-medium transition-colors",
                      collapsed ? "justify-center" : "gap-3",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="size-5 shrink-0" />
                    {!collapsed && (
                      <span className="truncate">{link.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

type SearchResultsProps = {
  pathname: string;
  homeHref: string;
  results: SearchEntry[];
  onLinkClick?: () => void;
};

function SearchResults({
  pathname,
  homeHref,
  results,
  onLinkClick,
}: SearchResultsProps) {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
        نتائج البحث
      </p>
      <ul className="space-y-1">
        {results.map((result) => {
          const Icon = AppIcons[result.icon];
          const isHomeLink =
            normalizePathname(result.href) === normalizePathname(homeHref);
          const isDashboardRoot = normalizePathname(pathname) === DASHBOARD_ROOT;
          const active = isHomeLink
            ? normalizePathname(pathname) === normalizePathname(result.href) ||
              isDashboardRoot
            : isRouteActive(pathname, result.href);

          return (
            <li key={result.id} className="max-w-full overflow-hidden">
              <Link
                href={result.href}
                onClick={onLinkClick}
                className={cn(
                  "flex min-h-11 w-full max-w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" />
                <div className="min-w-0 max-w-full">
                  <p className="truncate">{result.label}</p>
                  {result.parentLabel && (
                    <p
                      className={cn(
                        "truncate text-[11px]",
                        active
                          ? "text-primary-foreground/85"
                          : "text-muted-foreground",
                      )}
                    >
                      {result.parentLabel}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type SideBarContentProps = {
  pathname: string;
  visualExpanded: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onLinkClick?: () => void;
};

function SideBarContent({
  pathname,
  visualExpanded,
  searchValue,
  onSearchChange,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
}: SideBarContentProps) {
  const { dashboardRole, can } = useAuth();
  const role = dashboardRole === "admin"
    ? "admin"
    : dashboardRole === "org_staff"
      ? "organization_staff"
      : dashboardRole === "org_owner"
        ? "organization_owner"
        : getRoleFromPath(pathname);
  const links = getRoleLinks(role, can);
  const homeHref = getDashboardHomeByRole(role);
  const searchIndex = buildSearchIndex(links);
  const groupedLinks = groupLinksBySection(links);

  const normalizedQuery = searchValue.trim().toLowerCase();
  const searchResults = !normalizedQuery
    ? []
    : searchIndex.filter((entry) => {
        const searchableText =
          `${entry.label} ${entry.parentLabel ?? ""}`.toLowerCase();
        return searchableText.includes(normalizedQuery);
      });

  const filteredGroupedLinks = !normalizedQuery
    ? groupedLinks
    : findMatchingLinks(links, searchResults);

  return (
    <div
      className="flex h-full flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={cn("px-3 pb-3 pt-4", !visualExpanded && "px-2")}>
        <div
          className={cn(
            "mb-2 flex",
            visualExpanded ? "items-center" : "justify-center",
          )}
        >
          <Link
            href={getDashboardHomeByRole(role)}
            className={cn(
              "flex min-w-0 items-center justify-center p-3",
              !visualExpanded ? "w-fit" : "flex-1 gap-3",
            )}
          >
            <Logo priority />
          </Link>
        </div>

        {visualExpanded && (
          <div className="relative">
            <AppIcons.search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="ابحث بالروابط أو التبويبات أو المسار"
              className="ps-9 text-xs placeholder:text-xs"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {normalizedQuery ? (
          searchResults.length > 0 ? (
            <SearchResults
              pathname={pathname}
              homeHref={homeHref}
              results={searchResults}
              onLinkClick={onLinkClick}
            />
          ) : (
            <p className="px-2 text-sm text-muted-foreground">
              لا توجد نتائج مطابقة.
            </p>
          )
        ) : (
          <NavGroupedList
            pathname={pathname}
            homeHref={homeHref}
            collapsed={!visualExpanded}
            groupedLinks={filteredGroupedLinks}
            onLinkClick={onLinkClick}
          />
        )}
      </div>
    </div>
  );
}

export function SideBar() {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [collapsed, setCollapsed] = usePersistedCollapsed();
  const [hoverExpanded, setHoverExpanded] = React.useState(false);
  const [mobileOpen, setMobileOpen] = useQueryDisclosure("mobile-sidebar");
  const [searchState, setSearchState] = React.useState(() => ({
    pathname,
    value: "",
  }));
  const searchValue = searchState.pathname === pathname ? searchState.value : "";

  const handleSearchChange = React.useCallback(
    (value: string) => setSearchState({ pathname, value }),
    [pathname],
  );

  React.useEffect(() => {
    const media = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
      if (event.matches) setMobileOpen(false);
    };

    handleChange(media);
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, [setMobileOpen]);

  React.useEffect(() => {
    const handleToggle = () => {
      if (isDesktop) {
        setCollapsed((current) => !current);
      } else {
        setMobileOpen((current) => !current);
      }
    };

    window.addEventListener(SIDEBAR_TOGGLE_EVENT, handleToggle);
    return () => window.removeEventListener(SIDEBAR_TOGGLE_EVENT, handleToggle);
  }, [isDesktop, setCollapsed, setMobileOpen]);

  const visualExpanded = !collapsed || hoverExpanded;
  const pinnedOpen = !collapsed;

  const handleTogglePinned = React.useCallback(() => {
    setCollapsed((current) => !current);
    setHoverExpanded(false);
  }, [setCollapsed]);

  const handleMouseEnter = () => {
    if (isDesktop && collapsed) {
      setHoverExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (isDesktop && collapsed) {
      setHoverExpanded(false);
    }
  };

  return (
    <>
      <aside
        className={cn(
          "relative hidden h-screen shrink-0 border-l border-border bg-card transition-[width] duration-300 lg:flex",
          visualExpanded ? "w-72.5" : "w-23",
        )}
      >
        <SideBarContent
          pathname={pathname}
          visualExpanded={visualExpanded}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleTogglePinned}
          title={pinnedOpen ? "طي الشريط الجانبي" : "تثبيت الشريط الجانبي"}
          aria-label={pinnedOpen ? "طي الشريط الجانبي" : "تثبيت الشريط الجانبي"}
          aria-pressed={pinnedOpen}
          className={cn(
            "absolute top-20 z-20 size-7 rounded-full border-border bg-card text-muted-foreground shadow-md",
            "hover:bg-primary hover:text-primary-foreground hover:border-primary",
            "focus-visible:ring-2 focus-visible:ring-primary/40",
            // Sit on the content-facing edge of the right sidebar
            "-left-3.5",
          )}
        >
          {pinnedOpen ? (
            <AppIcons.chevronRight className="size-3.5" />
          ) : (
            <AppIcons.chevronLeft className="size-3.5" />
          )}
        </Button>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="w-75 border-border bg-card p-0 sm:max-w-75"
        >
          <SideBarContent
            pathname={pathname}
            visualExpanded
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            onLinkClick={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
