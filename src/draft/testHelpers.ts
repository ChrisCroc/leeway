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

export function makeFixedLines(
  rent: Partial<FixedDraft> = {},
  invoices: Partial<FixedDraft> = {}
): FixedDraft[] {
  const defaultRent: FixedDraft = {
    id: "fixed-1",
    label: "rent",
    amount: "750",
    dueDay: "5",
  }

  const defaultInvoices: FixedDraft = {
    id: "fixed-2",
    label: "invoices",
    amount: "150",
    dueDay: "10",
  }
  return [
    { ...defaultRent, ...rent },
    { ...defaultInvoices, ...invoices },
  ]
}
