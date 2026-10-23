/* SeverityFilter — PR-wide "3 CRITICAL · 5 WARNING · 2 SUGGESTION" counters.
   Clicking a level shows only its findings; clicking the active level again
   clears the filter. A level with no findings is dimmed and inert. */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Chip, SEV } from "@devdigest/ui";
import type { FindingRecord, Severity } from "@devdigest/shared";
import { SEVERITY_LEVELS } from "./constants";
import { countBySeverity } from "./helpers";
import { s } from "./styles";

export function SeverityFilter({
  findings,
  active,
  onChange,
}: {
  findings: FindingRecord[];
  active: Severity | null;
  onChange: (level: Severity | null) => void;
}) {
  const t = useTranslations("prReview");
  const counts = React.useMemo(() => countBySeverity(findings), [findings]);

  return (
    <div style={s.bar} role="group" aria-label={t("panel.severityFilter")}>
      {SEVERITY_LEVELS.map((level, i) => {
        const count = counts[level];
        const isActive = active === level;
        return (
          <React.Fragment key={level}>
            {i > 0 && <span style={s.separator}>·</span>}
            <span style={count === 0 && !isActive ? s.empty : undefined}>
              <Chip
                active={isActive}
                icon={SEV[level].icon}
                color={SEV[level].c}
                onClick={count === 0 && !isActive ? undefined : () => onChange(isActive ? null : level)}
              >
                {t("panel.severityCount", { count, level: t(`panel.severity.${level}`) })}
              </Chip>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
