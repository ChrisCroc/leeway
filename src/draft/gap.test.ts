import { test, expect } from "vitest"
import { computeGap } from "./gap"
import { makeFields, makeFixedLines } from "./testHelpers"
import type { Gap } from "./types"

test("is balanced when every euro is dispatched", () => {
  const gap = computeGap(makeFields(), makeFixedLines())

  expect(gap).toEqual({ kind: "balanced" } satisfies Gap)
})

test("tells how much is left when less is dispatched than available", () => {
  const gap = computeGap(makeFields({ leisure: "250" }), makeFixedLines())

  expect(gap).toEqual({ kind: "left", amount: 50 } satisfies Gap)
})

test("tells how much is overspent when more is dispatched than available", () => {
  const gap = computeGap(makeFields({ leisure: "350" }), makeFixedLines())

  expect(gap).toEqual({ kind: "over", amount: 50 } satisfies Gap)
})
