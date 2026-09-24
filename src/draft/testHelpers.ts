import type { FixedDraft, ScalarFields } from "./types"

export function makeFields(overrides: Partial<ScalarFields> = {}): ScalarFields {
  const defaultFields: ScalarFields = {
    available: "1800",
    savingsTarget: "200",
    savingsFloor: "100",
    necessity: "400",
    leisure: "300",
  }
  return { ...defaultFields, ...overrides }
}

export function makeFixedLines(rent = "750", invoices = "150"): FixedDraft[] {
  return [
    { id: "fixed-1", label: "rent", amount: rent, dueDay: "5" },
    { id: "fixed-2", label: "invoices", amount: invoices, dueDay: "10" }
  ]
}
