"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import type { DashboardRole } from "@/features/shared/auth.services/auth.type";
import { useAuth } from "@/providers/AuthProvider";

type QueryModalValue = string | number | boolean | null | undefined;
type QueryModalHistoryMode = "push" | "replace";

type QueryModalOptions = {
  queryKey?: string;
  idKey?: string;
  modeKey?: string;
  extraKeys?: readonly string[];
  history?: QueryModalHistoryMode;
  permission?: string;
  permissionsByMode?: Readonly<Record<string, string>>;
  roles?: readonly DashboardRole[];
};

type OpenQueryModalOptions = {
  id?: QueryModalValue;
  mode?: QueryModalValue;
  params?: Record<string, QueryModalValue>;
  history?: QueryModalHistoryMode;
};

const QUERY_MODAL_CHANGE_EVENT = "jod:query-modal-change";
const EMPTY_QUERY_KEYS: readonly string[] = [];
const EMPTY_PERMISSION_MAP: Readonly<Record<string, string>> = {};
const EMPTY_ROLES: readonly DashboardRole[] = [];

function getSearchSnapshot(): string {
  return typeof window === "undefined" ? "" : window.location.search;
}

function subscribeToSearchChanges(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("popstate", callback);
  window.addEventListener(QUERY_MODAL_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(QUERY_MODAL_CHANGE_EVENT, callback);
  };
}

function setQueryValue(
  params: URLSearchParams,
  key: string,
  value: QueryModalValue,
): void {
  if (value === undefined || value === null || value === "") {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}

function clearModalValues(
  params: URLSearchParams,
  queryKey: string,
  idKey: string,
  modeKey: string,
  extraKeys: readonly string[],
): void {
  params.delete(queryKey);
  params.delete(idKey);
  params.delete(modeKey);
  extraKeys.forEach((key) => params.delete(key));
}

function commitSearchParams(
  params: URLSearchParams,
  historyMode: QueryModalHistoryMode,
): void {
  if (typeof window === "undefined") return;

  const search = params.toString();
  const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
  const method = historyMode === "push" ? "pushState" : "replaceState";

  window.history[method](window.history.state, "", url);
  window.dispatchEvent(new Event(QUERY_MODAL_CHANGE_EVENT));
}

function getRequiredRouteRole(pathname: string): DashboardRole | null {
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  if (pathname.startsWith("/dashboard/org-owner")) return "org_owner";
  if (pathname.startsWith("/dashboard/org-staff")) return "org_staff";
  return null;
}

function toQueryString(value: QueryModalValue): string | null {
  if (value === undefined || value === null || value === "") return null;
  return String(value);
}

export function useQueryModal(
  name: string,
  options: QueryModalOptions = {},
) {
  const pathname = usePathname();
  const { can, dashboardRole, isLoading } = useAuth();

  const queryKey = options.queryKey ?? "modal";
  const idKey = options.idKey ?? `${queryKey}Id`;
  const modeKey = options.modeKey ?? `${queryKey}Mode`;
  const extraKeys = options.extraKeys ?? EMPTY_QUERY_KEYS;
  const defaultHistory = options.history ?? "replace";
  const permissionsByMode = options.permissionsByMode ?? EMPTY_PERMISSION_MAP;
  const allowedRoles = options.roles ?? EMPTY_ROLES;
  const requiredRouteRole = getRequiredRouteRole(pathname);

  const searchSnapshot = React.useSyncExternalStore(
    subscribeToSearchChanges,
    getSearchSnapshot,
    () => "",
  );

  const searchParams = React.useMemo(
    () => new URLSearchParams(searchSnapshot),
    [searchSnapshot],
  );

  const requestedOpen = searchParams.get(queryKey) === name;
  const requestedMode = requestedOpen ? searchParams.get(modeKey) : null;
  const id = requestedOpen ? searchParams.get(idKey) : null;
  const mode = requestedMode;
  const hasModePermissionRules = Object.keys(permissionsByMode).length > 0;
  const hasRoleGuard = requiredRouteRole !== null || allowedRoles.length > 0;
  const hasPermissionGuard = Boolean(options.permission) || hasModePermissionRules;
  const hasAccessGuard = hasRoleGuard || hasPermissionGuard;

  const isRoleAllowed = React.useCallback(() => {
    if (requiredRouteRole && dashboardRole !== requiredRouteRole) return false;
    if (allowedRoles.length > 0 && (!dashboardRole || !allowedRoles.includes(dashboardRole))) {
      return false;
    }
    return true;
  }, [allowedRoles, dashboardRole, requiredRouteRole]);

  const isModeAllowed = React.useCallback(
    (candidateMode: string | null) => {
      if (!hasPermissionGuard) return true;

      const requiredPermission =
        (candidateMode ? permissionsByMode[candidateMode] : undefined) ??
        options.permission;

      return Boolean(requiredPermission && can(requiredPermission));
    }, [can, hasPermissionGuard, options.permission, permissionsByMode],
  );

  const isAuthorized =
    !hasAccessGuard ||
    (!isLoading && isRoleAllowed() && isModeAllowed(requestedMode));
  const isOpen = requestedOpen && isAuthorized;

  React.useEffect(() => {
    if (!requestedOpen || !hasAccessGuard || isLoading || isAuthorized) return;

    const next = new URLSearchParams(getSearchSnapshot());
    if (next.get(queryKey) !== name) return;

    clearModalValues(next, queryKey, idKey, modeKey, extraKeys);
    commitSearchParams(next, "replace");
  }, [
    extraKeys,
    hasAccessGuard,
    idKey,
    isAuthorized,
    isLoading,
    modeKey,
    name,
    queryKey,
    requestedOpen,
  ]);

  const open = React.useCallback(
    (openOptions: OpenQueryModalOptions = {}) => {
      const candidateMode = toQueryString(openOptions.mode);
      const canOpen =
        !hasAccessGuard ||
        (!isLoading && isRoleAllowed() && isModeAllowed(candidateMode));

      if (!canOpen) return;

      const next = new URLSearchParams(getSearchSnapshot());
      next.set(queryKey, name);
      setQueryValue(next, idKey, openOptions.id);
      setQueryValue(next, modeKey, openOptions.mode);

      for (const key of extraKeys) {
        setQueryValue(next, key, openOptions.params?.[key]);
      }

      commitSearchParams(next, openOptions.history ?? defaultHistory);
    },
    [
      defaultHistory,
      extraKeys,
      hasAccessGuard,
      idKey,
      isLoading,
      isModeAllowed,
      isRoleAllowed,
      modeKey,
      name,
      queryKey,
    ],
  );

  const close = React.useCallback(
    (historyMode: QueryModalHistoryMode = defaultHistory) => {
      const next = new URLSearchParams(getSearchSnapshot());
      if (next.get(queryKey) !== name) return;

      clearModalValues(next, queryKey, idKey, modeKey, extraKeys);
      commitSearchParams(next, historyMode);
    },
    [defaultHistory, extraKeys, idKey, modeKey, name, queryKey],
  );

  const onOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) close();
    },
    [close],
  );

  const getParam = React.useCallback(
    (key: string): string | null => (isOpen ? searchParams.get(key) : null),
    [isOpen, searchParams],
  );

  return React.useMemo(
    () => ({
      isOpen,
      isAuthorized,
      id,
      mode,
      open,
      close,
      onOpenChange,
      getParam,
    }) as const,
    [close, getParam, id, isAuthorized, isOpen, mode, onOpenChange, open],
  );
}

export function useQueryDisclosure(
  name: string,
  options: QueryModalOptions = {},
): readonly [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const { isOpen, open, close } = useQueryModal(name, options);

  const setOpen = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (nextValue) => {
      const nextOpen =
        typeof nextValue === "function"
          ? nextValue(isOpen)
          : nextValue;

      if (nextOpen) open();
      else close();
    },
    [close, isOpen, open],
  );

  return [isOpen, setOpen] as const;
}
