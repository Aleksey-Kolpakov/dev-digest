import type { Severity } from "@devdigest/shared";

/** Severity levels, most severe first — the order counts and rows render in. */
export const SEVERITY_LEVELS: readonly Severity[] = ["CRITICAL", "WARNING", "SUGGESTION"];

/** Popover geometry (px). */
export const POPOVER_WIDTH = 380;
export const POPOVER_MAX_HEIGHT = 380;
export const POPOVER_GAP = 6;
export const VIEWPORT_MARGIN = 8;
