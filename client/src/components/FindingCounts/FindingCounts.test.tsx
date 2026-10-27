import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { FindingRecord, Severity } from "@devdigest/shared";
import messages from "../../../messages/en/prReview.json";
import { FindingCounts } from "./FindingCounts";
import { popoverPosition, sortBySeverity } from "./helpers";

afterEach(cleanup);

function finding(id: string, severity: Severity): FindingRecord {
  return {
    id,
    severity,
    category: "security",
    title: `Finding ${id}`,
    file: "src/a.ts",
    start_line: 3,
    end_line: 5,
    rationale: `Because ${id}`,
    suggestion: null,
    confidence: 0.9,
    kind: "finding",
    trifecta_components: null,
    evidence: null,
    review_id: "r1",
    accepted_at: null,
    dismissed_at: null,
  };
}

const FINDINGS = [finding("w1", "WARNING"), finding("c1", "CRITICAL"), finding("c2", "CRITICAL")];

function renderCounts(findings: FindingRecord[], props: { onSelect?: (f: FindingRecord) => void } = {}) {
  const onRowClick = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
      <div onClick={onRowClick}>
        <FindingCounts findings={findings} {...props} />
      </div>
    </NextIntlClientProvider>,
  );
  return { onRowClick };
}

const trigger = () => screen.getByRole("button", { name: /3 findings/ });

describe("FindingCounts", () => {
  it("shows a count per non-empty level and hides empty ones", () => {
    renderCounts(FINDINGS);
    expect(trigger().textContent).toBe("21");
    expect(trigger()).toHaveAccessibleName(
      "3 findings: 2 critical, 1 warning, 0 suggestion. Show details",
    );
  });

  it("renders a dash when there are no findings", () => {
    renderCounts([]);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("opens a popover listing every finding, without bubbling to the row", () => {
    const { onRowClick } = renderCounts(FINDINGS);
    fireEvent.click(trigger());
    expect(onRowClick).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { name: "3 findings" });
    expect(dialog).toHaveTextContent("Finding c1");
    expect(dialog).toHaveTextContent("Finding w1");
    expect(dialog).toHaveTextContent("src/a.ts:3-5");
    expect(dialog).toHaveTextContent("Because c2");
  });

  it("closes on Escape and on a second click", () => {
    renderCounts(FINDINGS);
    fireEvent.click(trigger());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(trigger());
    fireEvent.click(trigger());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("selecting a finding calls onSelect, closes, and does not bubble", () => {
    const onSelect = vi.fn();
    const { onRowClick } = renderCounts(FINDINGS, { onSelect });
    fireEvent.click(trigger());
    fireEvent.click(screen.getByText("Finding w1"));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "w1" }));
    expect(onRowClick).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("FindingCounts helpers", () => {
  it("sorts most severe first", () => {
    expect(sortBySeverity(FINDINGS).map((f) => f.id)).toEqual(["c1", "c2", "w1"]);
  });

  it("opens below the trigger, or above when there is no room below", () => {
    const vp = { width: 1200, height: 800 };
    expect(popoverPosition({ top: 100, bottom: 120, left: 50 }, vp).top).toBe(126);
    const flipped = popoverPosition({ top: 760, bottom: 780, left: 1100 }, vp);
    expect(flipped.top).toBeUndefined();
    expect(flipped.bottom).toBe(46);
    expect(flipped.left).toBe(1200 - 380 - 8);
  });
});
