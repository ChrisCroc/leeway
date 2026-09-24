import type { FixedDraft, Gap, ScalarFields } from "./types"

export function computeGap(fields: ScalarFields, fixedLines: FixedDraft[]): Gap {
  const fixedTotal = fixedLines.reduce(
    (total, line) => total + Number(line.amount),
    0
  )

  const remaining =
    Number(fields.available) -
    fixedTotal -
    Number(fields.savingsTarget) -
    Number(fields.necessity) -
    Number(fields.leisure)

  if (remaining > 0) {
    return { kind: "left", amount: remaining }
  }
  if (remaining < 0) {
    return { kind: "over", amount: Math.abs(remaining) }
  }
  return { kind: "balanced" }
}
