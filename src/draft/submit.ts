import { computeGap } from "./gap"
import type { FixedDraft, ScalarFields } from "./types"

export function canSubmit(fields: ScalarFields, fixedLines: FixedDraft[]): boolean {
  if (Object.values(fields).some((value) => value.trim() === "")) {
    return false
  }

  return computeGap(fields, fixedLines).kind === "balanced"
}
