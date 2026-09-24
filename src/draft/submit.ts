import { computeGap } from "./gap"
import type { FixedDraft, ScalarFields } from "./types"

function isValidDueDay(text: string): boolean {
  const trimmed = text.trim()
  if (!/^\d+$/.test(trimmed)) {
    return false
  }
  const day = Number(trimmed)
  return day >= 1 && day <= 31
}

export function canSubmit(fields: ScalarFields, fixedLines: FixedDraft[]): boolean {
  if (Object.values(fields).some((value) => value.trim() === "")) {
    return false
  }
  if (
    fixedLines.some(
      (line) =>
        line.label.trim() === "" ||
        line.amount.trim() === "" ||
        !isValidDueDay(line.dueDay)
    )
  ) {
    return false
  }

  return computeGap(fields, fixedLines).kind === "balanced"
}
