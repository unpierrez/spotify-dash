"use server";

import { updateTag } from "next/cache";
import { DASHBOARD_TAG } from "@/lib/spotify";

const COOLDOWN_MS = 5 * 60 * 1000;

let lastRefreshAt = 0;

export type RefreshResult = { status: "updated" } | { status: "cooldown"; minutes: number };

export async function refreshDashboard(): Promise<RefreshResult> {
  const remaining = lastRefreshAt + COOLDOWN_MS - Date.now();
  if (remaining > 0) {
    return { status: "cooldown", minutes: Math.ceil(remaining / 60_000) };
  }

  lastRefreshAt = Date.now();
  updateTag(DASHBOARD_TAG);
  return { status: "updated" };
}
