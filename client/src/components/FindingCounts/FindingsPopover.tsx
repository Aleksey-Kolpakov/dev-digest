/* FindingsPopover — the findings behind a set of severity counters, anchored
   under the trigger. Portaled to <body> with fixed positioning because the PR
   list's table card clips overflow. Closes on outside click, Esc, scroll and
   resize. */
"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import {
  Icon,
  SeverityBadge,
  CategoryTag,
  MonoLink,
  ConfidenceNum,
  type Category,
} from "@devdigest/ui";
import type { FindingRecord } from "@devdigest/shared";
import { githubBlobUrl } from "@/lib/github-urls";
import { lineLabel, popoverPosition, sortBySeverity } from "./helpers";
import { s } from "./styles";

export function FindingsPopover({
  findings,
  anchor,
  onClose,
  onSelect,
  repoFullName,
  headSha,
}: {
  findings: FindingRecord[];
  /** The trigger element; clicks on it are not "outside" (it toggles itself). */
  anchor: HTMLElement;
  onClose: () => void;
  onSelect?: (f: FindingRecord) => void;
  repoFullName?: string | null;
  headSha?: string | null;
}) {
  const t = useTranslations("prReview");
  const ref = React.useRef<HTMLDivElement | null>(null);
  const sorted = React.useMemo(() => sortBySeverity(findings), [findings]);
  const pos = popoverPosition(anchor.getBoundingClientRect(), {
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    const inside = (target: EventTarget | null) =>
      target instanceof Node && (ref.current?.contains(target) || anchor.contains(target));
    const onPointer = (e: MouseEvent) => {
      if (!inside(e.target)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // Scrolling the popover's own list must not close it.
    const onScroll = (e: Event) => {
      if (!inside(e.target)) onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onClose);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onClose);
    };
  }, [anchor, onClose]);

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={t("findingCounts.header", { count: findings.length })}
      // Portaled DOM, but React events still bubble to the trigger's ancestors
      // (e.g. the clickable PR row) — stop them here.
      onClick={(e) => e.stopPropagation()}
      style={{ ...s.popover, top: pos.top, bottom: pos.bottom, left: pos.left, maxHeight: pos.maxHeight }}
    >
      <div style={s.header}>
        <Icon.Info size={12} />
        {t("findingCounts.header", { count: findings.length })}
      </div>
      <div style={s.list}>
        {sorted.map((f) => {
          const fileHref =
            repoFullName && headSha
              ? githubBlobUrl(repoFullName, headSha, f.file, f.start_line, f.end_line)
              : undefined;
          return (
            <div
              key={f.id}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              onClick={() => {
                if (!onSelect) return;
                onSelect(f);
                onClose();
              }}
              onKeyDown={(e) => {
                if (onSelect && e.key === "Enter") {
                  onSelect(f);
                  onClose();
                }
              }}
              style={s.row(!!onSelect)}
            >
              <SeverityBadge severity={f.severity} compact />
              <div style={s.content}>
                <div style={s.title}>
                  {f.title}
                  <span style={s.category}>
                    <CategoryTag category={f.category as Category} />
                  </span>
                </div>
                <div style={s.metaRow}>
                  <span style={s.file} title={`${f.file}:${lineLabel(f)}`} onClick={(e) => e.stopPropagation()}>
                    <MonoLink href={fileHref}>
                      {f.file}:{lineLabel(f)}
                    </MonoLink>
                  </span>
                  <span style={s.confidence}>
                    <ConfidenceNum value={f.confidence} />
                  </span>
                </div>
                <div style={s.rationale}>{f.rationale}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>,
    document.body,
  );
}
