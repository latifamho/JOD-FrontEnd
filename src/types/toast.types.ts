export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastOptions {
  title?: string;
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
}

export interface ToastRequest extends ToastOptions {
  id: string;
  type: ToastType;
  message: string;
  createdAt: number;
}

export type ToastEvent =
  | { type: "add"; toast: ToastRequest }
  | { type: "dismiss"; id: string }
  | { type: "clear"; position?: ToastPosition };

export interface ToastApi {
  show: (type: ToastType, message: string, options?: ToastOptions) => string;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: (position?: ToastPosition) => void;
}
