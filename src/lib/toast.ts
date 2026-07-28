import type {
  ToastApi,
  ToastEvent,
  ToastOptions,
  ToastRequest,
  ToastType,
} from "@/types/toast.types";

type ToastListener = (event: ToastEvent) => void;

type ToastStore = {
  listeners: Set<ToastListener>;
  pendingEvents: ToastEvent[];
  sequence: number;
};

type ToastGlobal = typeof globalThis & {
  __JOD_TOAST_STORE__?: ToastStore;
};

function getToastStore(): ToastStore {
  const target = globalThis as ToastGlobal;

  if (!target.__JOD_TOAST_STORE__) {
    target.__JOD_TOAST_STORE__ = {
      listeners: new Set<ToastListener>(),
      pendingEvents: [],
      sequence: 0,
    };
  }

  return target.__JOD_TOAST_STORE__;
}

function createToastId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  const store = getToastStore();
  store.sequence += 1;
  return `toast-${Date.now()}-${store.sequence}`;
}

function emit(event: ToastEvent): void {
  const store = getToastStore();

  if (store.listeners.size === 0) {
    store.pendingEvents.push(event);
    store.pendingEvents = store.pendingEvents.slice(-20);
    return;
  }

  store.listeners.forEach((listener) => listener(event));
}

function show(
  type: ToastType,
  message: string,
  options: ToastOptions = {},
): string {
  const request: ToastRequest = {
    id: createToastId(),
    type,
    message,
    createdAt: Date.now(),
    ...options,
  };

  emit({ type: "add", toast: request });
  return request.id;
}

export const toast: ToastApi = {
  show,
  success: (message, options) => show("success", message, options),
  error: (message, options) => show("error", message, options),
  warning: (message, options) => show("warning", message, options),
  info: (message, options) => show("info", message, options),
  dismiss: (id) => emit({ type: "dismiss", id }),
  clear: (position) => emit({ type: "clear", position }),
};

export function subscribeToToasts(listener: ToastListener): () => void {
  const store = getToastStore();
  store.listeners.add(listener);

  const pendingEvents = store.pendingEvents.splice(0);
  pendingEvents.forEach((event) => listener(event));

  return () => {
    store.listeners.delete(listener);
  };
}
