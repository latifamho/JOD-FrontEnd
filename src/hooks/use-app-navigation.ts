"use client"

import { useRouter } from "next/navigation"

import { resolveRoute, type RouteKey, type RouteScopes } from "@/constant/routes"

export function useAppNavigation() {
  const router = useRouter()

  return {
    pushRoute<S extends keyof RouteScopes>(
      scope: S,
      key: RouteKey<S>,
      params?: Record<string, string | number>
    ) {
      router.push(resolveRoute(scope, key, params))
    },
    replaceRoute<S extends keyof RouteScopes>(
      scope: S,
      key: RouteKey<S>,
      params?: Record<string, string | number>
    ) {
      router.replace(resolveRoute(scope, key, params))
    },
  }
}
