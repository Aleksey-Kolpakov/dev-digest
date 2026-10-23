import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { FindingRecord, ReviewRecord } from "@devdigest/shared";
import messages from "../../../../../../../../messages/en/prReview.json";

vi.mock("../../../../../../../lib/hooks/reviews", () => ({
  useDeleteReview: () => ({ mutate: vi.fn(), isPending: false }),
  useFindingAction: () => ({ mutate: vi.fn(), isPending: false }),
}));

import { ReviewRunAccordion } from "./ReviewRunAccordion";

afterEach(cleanup);

function finding(id: string, severity: FindingRecord["severity"]): FindingRecord {
  return {
    id,
    severity,
    category: "bug",
    title: `Finding ${id}`,
    file: "src/a.ts",
    start_line: 1,
    end_line: 1,
    rationale: "r",
    suggestion: null,
    confidence: 0.9,
    kind: "finding",
    trifecta_components: null,
    evidence: null,
    review_id: "rv1",
    accepted_at: null,
    dismissed_at: null,
  };
}

const REVIEW: ReviewRecord = {
  id: "rv1",
  pr_id: "pr1",
  agent_id: "a1",
  run_id: "run-1",
  agent_name: "Security Reviewer",
  kind: "review",
  verdict: "request_changes",
  summary: "Two blockers.",
  score: 38,
  model: "m",
  created_at: "2026-06-13T20:52:51.000Z",
  findings: [finding("c1", "CRITICAL"), finding("w1", "WARNING")],
};

function renderAccordion(props: Partial<React.ComponentProps<typeof ReviewRunAccordion>> = {}) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
      <ReviewRunAccordion review={REVIEW} prId="pr1" defaultOpen {...props} />
    </NextIntlClientProvider>,
  );
}

describe("ReviewRunAccordion", () => {
  it("shows the run cost in the header, '—' when unpriced", () => {
    renderAccordion({ costUsd: 0.0013 });
    expect(screen.getByText("$0.0013")).toBeInTheDocument();
    cleanup();
    renderAccordion({ costUsd: null });
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("the trace link opens the run trace without toggling the accordion", () => {
    const onOpenTrace = vi.fn();
    renderAccordion({ onOpenTrace });
    fireEvent.click(screen.getByRole("button", { name: "trace" }));
    expect(onOpenTrace).toHaveBeenCalledWith("run-1");
    expect(screen.getByText("Finding c1")).toBeInTheDocument(); // still open
  });

  it("filters its findings by the PR-wide severity", () => {
    renderAccordion({ severity: "WARNING" });
    expect(screen.getByText("Finding w1")).toBeInTheDocument();
    expect(screen.queryByText("Finding c1")).not.toBeInTheDocument();
  });
});
