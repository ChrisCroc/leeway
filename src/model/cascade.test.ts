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

test("counts only the part of the withdrawal that goes under the floor", () => {
  const budget = makeBudget({
    expenses: [
      {
        chargedTo: "leisure",
        date: "2026-09-05",
        withdrawals: [
          { source: "leisure", amount: 300 },
          { source: "savings", amount: 70 },
        ],
      },
    ],
  })

  const verdict = simulatePurchase(budget, 50, "leisure")

  expect(verdict).toEqual({
    kind: "breached",
    withdrawals: [{ source: "savings", amount: 50 }],
    breaches: [{ kind: "savingsFloor", amount: 20 }]
  })
})

test("compresses leisure before touching savings, whatever the origin", () => {
  const budget = makeBudget({
    expenses:[
      {
        chargedTo: "necessity",
        date: "2026-09-03",
        withdrawals: [{ source: "necessity", amount: 280 }],
      },
    ],
  })

  const verdict = simulatePurchase(budget, 200, "necessity")

  expect(verdict).toEqual({
    kind: "clear",
    withdrawals: [
      { source: "necessity", amount: 120 },
      { source: "leisure", amount: 80 },
    ],
  })
})

test("flags the necessity envelope when it has to be tapped", () => {
  const budget = makeBudget({
    expenses: [
      {
        chargedTo: "leisure",
        date: "2026-09-02",
        withdrawals: [
          { source: "leisure", amount: 300 },
          { source: "savings", amount: 200 },
        ],
      },
    ],
  })

  const verdict = simulatePurchase(budget, 80, "leisure")

  expect(verdict).toEqual({
    kind: "breached",
    withdrawals: [{ source: "necessity", amount: 80 }],
    breaches: [{ kind: "necessityUsed", amount: 80 }],
  })
})

test("", () => {
  const budget = makeBudget({
    expenses: [
      {
        chargedTo: "leisure",
        date: "2026-09-01",
        withdrawals: [
          { source: "leisure", amount: 300 },
          { source: "savings", amount: 200 },
          { source: "necessity", amount: 400 },
        ],
      }
    ],
  })

  const verdict = simulatePurchase(budget, 200, "leisure")

  expect(verdict).toEqual({
    kind: "breached",
    withdrawals: [{ source: "overdraft", amount: 200 }],
    breaches: [{ kind: "overdraft", amount: 200 }]
  })
})
