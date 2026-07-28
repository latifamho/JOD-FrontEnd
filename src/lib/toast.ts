import type {
  ToastApi,
  ToastEvent,
  ToastOptions,
  ToastRequest,
  ToastType,
} from "@/types/toast.types";

const listeners = new Set<(event: ToastEvent) => void>();
let sequence = 0;

function createToastId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  sequence += 1;
  return `toast-${Date.now()}-${sequence}`;
}

function emit(event: ToastEvent): void {
  listeners.forEach((listener) => listener(event));
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

export function subscribeToToasts(
  listener: (event: ToastEvent) => void,
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
