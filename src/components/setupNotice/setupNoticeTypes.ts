import type { DashboardResult } from "@/lib/types";

export type SetupNoticeResult = Exclude<DashboardResult, { status: "ok" }>;

export type SetupNoticeProps = { result: SetupNoticeResult };
