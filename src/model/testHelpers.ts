import type { MonthBudget } from "./types"

export function makeBudget(overrides: Partial<MonthBudget> = {}): MonthBudget {
  const defaultBudget: MonthBudget = {
    available: 1800,
    fixed: [
      { kind: "fixed", label: "rent", amount: 750, dueDay: 5 },
      { kind: "fixed", label: "invoices", amount: 150, dueDay: 10 }
    ],
    savings: { kind: "savings", target: 200, floor: 100 },
    necessity: { kind: "necessity", amount: 400 },
    leisure: { kind: "leisure", amount: 300 },
    expenses: [],
  }
  return { ...defaultBudget, ...overrides }
}
