import type { Severity } from "@devdigest/shared";
import { SEVERITY_LEVELS } from "./constants";

export { countBySeverity } from "@/components/FindingCounts";

/** Narrow an untrusted value (e.g. the `?sev` query param) to a severity level. */
export function parseSeverity(value: string | null | undefined): Severity | null {
  return SEVERITY_LEVELS.find((l) => l === value) ?? null;
}
