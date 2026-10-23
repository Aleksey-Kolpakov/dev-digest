import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { FindingRecord, Severity } from "@devdigest/shared";
import messages from "../../../../../../../../messages/en/prReview.json";
import { SeverityFilter } from "./SeverityFilter";
import { countBySeverity, parseSeverity } from "./helpers";

afterEach(cleanup);

function finding(id: string, severity: Severity): FindingRecord {
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
    review_id: "r1",
    accepted_at: null,
    dismissed_at: null,
  };
}

const FINDINGS: FindingRecord[] = [
  ...["c1", "c2", "c3"].map((id) => finding(id, "CRITICAL")),
  ...["w1", "w2", "w3", "w4", "w5"].map((id) => finding(id, "WARNING")),
  ...["s1", "s2"].map((id) => finding(id, "SUGGESTION")),
];

function renderFilter(findings: FindingRecord[], active: Severity | null, onChange = vi.fn()) {
  render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
      <SeverityFilter findings={findings} active={active} onChange={onChange} />
    </NextIntlClientProvider>,
  );
  return onChange;
}

describe("SeverityFilter", () => {
  it("renders a count per level", () => {
    renderFilter(FINDINGS, null);
    expect(screen.getByRole("group").textContent).toBe("3 CRITICAL·5 WARNING·2 SUGGESTION");
  });

  it("selects a level on click", () => {
    const onChange = renderFilter(FINDINGS, null);
    fireEvent.click(screen.getByRole("button", { name: "3 CRITICAL" }));
    expect(onChange).toHaveBeenCalledWith("CRITICAL");
  });

  it("clears the filter when the active level is clicked again", () => {
    const onChange = renderFilter(FINDINGS, "WARNING");
    fireEvent.click(screen.getByRole("button", { name: "5 WARNING" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("ignores clicks on a level with no findings", () => {
    const onChange = renderFilter([finding("w1", "WARNING")], null);
    fireEvent.click(screen.getByRole("button", { name: "0 CRITICAL" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("SeverityFilter helpers", () => {
  it("counts every level, zero included", () => {
    expect(countBySeverity([finding("w1", "WARNING")])).toEqual({ CRITICAL: 0, WARNING: 1, SUGGESTION: 0 });
  });

  it("parses only known levels", () => {
    expect(parseSeverity("CRITICAL")).toBe("CRITICAL");
    expect(parseSeverity("INFO")).toBeNull();
    expect(parseSeverity(null)).toBeNull();
  });
});
