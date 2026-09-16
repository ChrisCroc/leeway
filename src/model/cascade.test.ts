import { test, expect } from "vitest"
import { simulatePurchase } from "./cascade"
import { makeBudget } from "./testHelpers"

test("takes the purchase from its own enveloope when it fits", () => {
  const budget = makeBudget()

  const verdict = simulatePurchase(budget, 80, "leisure")

  expect(verdict).toEqual({
    kind: "clear",
    withdrawals: [{ source: "leisure", amount: 80 }],
  })
})

test("draws from savings when the envelope has run short", () => {
  const budget = makeBudget({
    expenses: [
      {
        chargedTo: "leisure",
        date: "2026-09-10",
        withdrawals: [{ source: "leisure", amount: 250 }]
      },
    ],
  })

  const verdict = simulatePurchase(budget, 80, "leisure")

  expect(verdict).toEqual({
    kind: "clear",
    withdrawals: [
      { source: "leisure", amount: 50 },
      { source: "savings", amount: 30 },
    ],
  })
})

test("reports the breach when savings must go under their floor", () => {
  const budget = makeBudget({
    expenses: [
      {
        chargedTo: "leisure",
        date: "2026-09-08",
        withdrawals: [
          { source: "leisure", amount: 300 },
          { source: "savings", amount: 100 },
        ],
      },
    ],
  })

  const verdict = simulatePurchase(budget, 80, "leisure")

  expect(verdict).toEqual({
    kind: "breached",
    withdrawals: [{ source: "savings", amount: 80 }],
    breaches: [{ kind: "savingsFloor", amount: 80 }]
  })
})
