/* FindingCounts — "⊘2 ⚠1 💡1" per-severity counters. Levels with no findings
   are hidden; no findings at all renders "—". Clicking toggles a popover that
   lists every finding behind the counts. The click never bubbles, so it is
   safe inside a clickable row. */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Icon, SEV } from "@devdigest/ui";
import type { FindingRecord } from "@devdigest/shared";
import { SEVERITY_LEVELS } from "./constants";
import { countBySeverity } from "./helpers";
import { FindingsPopover } from "./FindingsPopover";
import { s } from "./styles";

export function FindingCounts({
  findings,
  onSelect,
  repoFullName,
  headSha,
}: {
  findings: FindingRecord[];
  /** Clicking a finding in the popover (then it closes). Rows are inert without it. */
  onSelect?: (f: FindingRecord) => void;
  /** owner/repo + head sha — deep-link each finding's file:line to GitHub. */
  repoFullName?: string | null;
  headSha?: string | null;
}) {
  const t = useTranslations("prReview");
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const counts = React.useMemo(() => countBySeverity(findings), [findings]);
  const close = React.useCallback(() => setAnchor(null), []);

  if (findings.length === 0) return <span style={s.none}>—</span>;

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={anchor != null}
        aria-label={t("findingCounts.label", {
          count: findings.length,
          critical: counts.CRITICAL,
          warning: counts.WARNING,
          suggestion: counts.SUGGESTION,
        })}
        onClick={(e) => {
          e.stopPropagation();
          const el = e.currentTarget;
          setAnchor((cur) => (cur ? null : el));
        }}
        style={s.trigger}
      >
        {SEVERITY_LEVELS.filter((level) => counts[level] > 0).map((level) => {
          const I = Icon[SEV[level].icon];
          return (
            <span key={level} style={s.count(SEV[level].c)}>
              <I size={13} />
              {counts[level]}
            </span>
          );
        })}
      </button>
      {anchor && (
        <FindingsPopover
          findings={findings}
          anchor={anchor}
          onClose={close}
          onSelect={onSelect}
          repoFullName={repoFullName}
          headSha={headSha}
        />
      )}
    </>
  );
}
