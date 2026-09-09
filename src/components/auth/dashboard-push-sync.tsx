"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminNotificationsKeys } from "@/features/admin/notifications/admin.notifications.query-keys";
import { orgNotificationsKeys } from "@/features/org/notifications/org.notifications.query-keys";
import { authServices } from "@/features/shared/auth.services/auth.service";
import { toast } from "@/lib/toast";
import { getDashboardPushRegistration, subscribeToDashboardPushMessages } from "@/lib/web-push";
import { useAuth } from "@/providers/AuthProvider";

export function DashboardPushSync() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    let unsubscribe: (() => void) | null = null;
    void (async () => {
      try {
        const registration = await getDashboardPushRegistration();
        if (registration && active) await authServices.registerPushDevice(registration);
        unsubscribe = await subscribeToDashboardPushMessages((payload) => {
          toast.info(payload.notification?.body || "لديك تحديث جديد في لوحة التحكم.", { title: payload.notification?.title || "إشعار جديد", duration: 6000 });
          void queryClient.invalidateQueries({ queryKey: orgNotificationsKeys.all });
          void queryClient.invalidateQueries({ queryKey: adminNotificationsKeys.all });
        });
      } catch {}
    })();
    return () => { active = false; unsubscribe?.(); };
  }, [isAuthenticated, queryClient]);
  return null;
}
