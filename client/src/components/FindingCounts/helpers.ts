import type { FindingRecord, Severity } from "@devdigest/shared";
import {
  POPOVER_GAP,
  POPOVER_MAX_HEIGHT,
  POPOVER_WIDTH,
  SEVERITY_LEVELS,
  VIEWPORT_MARGIN,
} from "./constants";

/** Number of findings per severity level (every level present, zero included). */
export function countBySeverity(findings: FindingRecord[]): Record<Severity, number> {
  const counts = { CRITICAL: 0, WARNING: 0, SUGGESTION: 0 } satisfies Record<Severity, number>;
  for (const f of findings) {
    if (f.severity in counts) counts[f.severity] += 1;
  }
  return counts;
}

/** Most severe first; stable within a level. */
export function sortBySeverity(findings: FindingRecord[]): FindingRecord[] {
  const rank = (f: FindingRecord) => {
    const i = SEVERITY_LEVELS.indexOf(f.severity);
    return i === -1 ? SEVERITY_LEVELS.length : i;
  };
  return [...findings].sort((a, b) => rank(a) - rank(b));
}

/** Format a finding's line range ("11" when single-line, else "11-15"). */
export function lineLabel(f: Pick<FindingRecord, "start_line" | "end_line">): string {
  return f.start_line === f.end_line ? `${f.start_line}` : `${f.start_line}-${f.end_line}`;
}

/** Fixed-position box for the popover: below the trigger, flipped above when
 *  the viewport has no room below, clamped horizontally into the viewport. */
export function popoverPosition(
  anchor: Pick<DOMRect, "top" | "bottom" | "left">,
  viewport: { width: number; height: number },
): { top?: number; bottom?: number; left: number; maxHeight: number } {
  const left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(anchor.left, viewport.width - POPOVER_WIDTH - VIEWPORT_MARGIN),
  );
  const below = viewport.height - anchor.bottom - POPOVER_GAP - VIEWPORT_MARGIN;
  const above = anchor.top - POPOVER_GAP - VIEWPORT_MARGIN;
  if (below >= Math.min(POPOVER_MAX_HEIGHT, 200) || below >= above) {
    return { top: anchor.bottom + POPOVER_GAP, left, maxHeight: Math.min(POPOVER_MAX_HEIGHT, below) };
  }
  return {
    bottom: viewport.height - anchor.top + POPOVER_GAP,
    left,
    maxHeight: Math.min(POPOVER_MAX_HEIGHT, above),
  };
}
