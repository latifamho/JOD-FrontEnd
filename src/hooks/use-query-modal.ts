"use client";

import * as React from "react";

type QueryModalValue = string | number | boolean | null | undefined;
type QueryModalHistoryMode = "push" | "replace";

type QueryModalOptions = {
  queryKey?: string;
  idKey?: string;
  modeKey?: string;
  extraKeys?: string[];
  history?: QueryModalHistoryMode;
};

type OpenQueryModalOptions = {
  id?: QueryModalValue;
  mode?: QueryModalValue;
  params?: Record<string, QueryModalValue>;
  history?: QueryModalHistoryMode;
};

const QUERY_MODAL_CHANGE_EVENT = "jod:query-modal-change";
const EMPTY_QUERY_KEYS: string[] = [];

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

export function useQueryModal(
  name: string,
  options: QueryModalOptions = {},
) {
  const queryKey = options.queryKey ?? "modal";
  const idKey = options.idKey ?? `${queryKey}Id`;
  const modeKey = options.modeKey ?? `${queryKey}Mode`;
  const extraKeys = options.extraKeys ?? EMPTY_QUERY_KEYS;
  const defaultHistory = options.history ?? "replace";

  const searchSnapshot = React.useSyncExternalStore(
    subscribeToSearchChanges,
    getSearchSnapshot,
    () => "",
  );

  const searchParams = React.useMemo(
    () => new URLSearchParams(searchSnapshot),
    [searchSnapshot],
  );

  const isOpen = searchParams.get(queryKey) === name;
  const id = isOpen ? searchParams.get(idKey) : null;
  const mode = isOpen ? searchParams.get(modeKey) : null;

  const open = React.useCallback(
    (openOptions: OpenQueryModalOptions = {}) => {
      const next = new URLSearchParams(getSearchSnapshot());
      next.set(queryKey, name);
      setQueryValue(next, idKey, openOptions.id);
      setQueryValue(next, modeKey, openOptions.mode);

      for (const key of extraKeys) {
        setQueryValue(next, key, openOptions.params?.[key]);
      }

      commitSearchParams(next, openOptions.history ?? defaultHistory);
    },
    [defaultHistory, extraKeys, idKey, modeKey, name, queryKey],
  );

  const close = React.useCallback(
    (historyMode: QueryModalHistoryMode = defaultHistory) => {
      const next = new URLSearchParams(getSearchSnapshot());
      if (next.get(queryKey) !== name) return;

      next.delete(queryKey);
      next.delete(idKey);
      next.delete(modeKey);
      extraKeys.forEach((key) => next.delete(key));
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
      id,
      mode,
      open,
      close,
      onOpenChange,
      getParam,
    }) as const,
    [close, getParam, id, isOpen, mode, onOpenChange, open],
  );
}

export function useQueryDisclosure(
  name: string,
  options: QueryModalOptions = {},
): readonly [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const modal = useQueryModal(name, options);

  const setOpen = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (nextValue) => {
      const nextOpen =
        typeof nextValue === "function"
          ? nextValue(modal.isOpen)
          : nextValue;

      if (nextOpen) modal.open();
      else modal.close();
    },
    [modal.close, modal.isOpen, modal.open],
  );

  return [modal.isOpen, setOpen] as const;
}
