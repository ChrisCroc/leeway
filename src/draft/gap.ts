import type { FixedDraft, Gap, ScalarFields } from "./types"

function readAmount(text: string): number | null {
  const trimmed = text.trim()
  if (trimmed === "") {
    return 0
  }
  ///^\d+$/.test(trimmed) REGEX expression: the model contains only a list of numbers
  if (!/^\d+$/.test(trimmed)) {
    return null
  }
  return Number(trimmed)
}

export function computeGap(fields: ScalarFields, fixedLines: FixedDraft[]): Gap {
  const available = readAmount(fields.available)
  const savingsTarget = readAmount(fields.savingsTarget)
  const necessity = readAmount(fields.necessity)
  const leisure = readAmount(fields.leisure)

  if (
    available === null ||
    savingsTarget === null ||
    necessity === null ||
    leisure === null
  ) {
    return { kind: "unreadable" }
  }

  let fixedTotal = 0
  for (const line of fixedLines) {
    const amount = readAmount(line.amount)
    if (amount === null) {
      return { kind: "unreadable" }
    }
    fixedTotal += amount
  }

  const remaining = available - fixedTotal - savingsTarget - necessity - leisure

  if (remaining > 0) {
    return { kind: "left", amount: remaining }
  }
  if (remaining < 0) {
    return { kind: "over", amount: Math.abs(remaining) }
  }
  return { kind: "balanced" }
}
