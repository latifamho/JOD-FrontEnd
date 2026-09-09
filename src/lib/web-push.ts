"use client";

import { deleteToken, getMessaging, getToken, isSupported, onMessage, type MessagePayload } from "firebase/messaging";
import { firebaseApp } from "@/lib/firebase";

const SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";
const DEVICE_ID_STORAGE_KEY = "jod-dashboard-push-device-id";
const TOKEN_STORAGE_KEY = "jod-dashboard-fcm-token";

export type DashboardPushRegistration = { fcmToken: string; deviceId: string; appVersion: string };

function getOrCreateDeviceId(): string {
  const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existing) return existing;
  const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, id);
  return id;
}

export async function getDashboardPushRegistration(options: { requestPermission?: boolean } = {}): Promise<DashboardPushRegistration | null> {
  if (typeof window === "undefined" || !(await isSupported()) || !("serviceWorker" in navigator)) return null;
  let permission = Notification.permission;
  if (permission === "default" && options.requestPermission) permission = await Notification.requestPermission();
  if (permission !== "granted") return null;
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim();
  if (!vapidKey) return null;
  const serviceWorkerRegistration = await navigator.serviceWorker.register(SERVICE_WORKER_PATH);
  const fcmToken = await getToken(getMessaging(firebaseApp), { vapidKey, serviceWorkerRegistration });
  if (!fcmToken) return null;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, fcmToken);
  return { fcmToken, deviceId: getOrCreateDeviceId(), appVersion: process.env.NEXT_PUBLIC_APP_VERSION?.trim() || "web" };
}

export function getStoredDashboardPushToken(): string | null {
  return typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export async function deleteDashboardPushToken(): Promise<void> {
  if (typeof window === "undefined") return;
  try { if (await isSupported()) await deleteToken(getMessaging(firebaseApp)); }
  finally { window.localStorage.removeItem(TOKEN_STORAGE_KEY); }
}

export async function subscribeToDashboardPushMessages(listener: (payload: MessagePayload) => void): Promise<(() => void) | null> {
  if (typeof window === "undefined" || !(await isSupported())) return null;
  return onMessage(getMessaging(firebaseApp), listener);
}
