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

test("counts an empty field as zero", () => {
  const gap = computeGap(makeFields({ leisure: "" }), makeFixedLines())

  expect(gap).toEqual({ kind: "left", amount: 300 } satisfies Gap)
})

test("ignores spaces around an amount", () => {
  const gap = computeGap(makeFields({ leisure: " 300 " }), makeFixedLines())

  expect(gap).toEqual({ kind: "balanced" } satisfies Gap)
})

test("is unreadable when an amount has decimals", () => {
  const gap = computeGap(makeFields({ leisure: "12,5" }), makeFixedLines())

  expect(gap).toEqual({ kind: "unreadable" } satisfies Gap)
})

test("is unreadable when a fixed charge is negative", () => {
  const gap = computeGap(makeFields(), makeFixedLines({ amount: "-750" }))

  expect(gap).toEqual({ kind: "unreadable" } satisfies Gap)
})

test("is unreadable when the savings floor cannot be read", () => {
  const gap = computeGap(makeFields({ savingsFloor: "abc" }), makeFixedLines())

  expect(gap).toEqual({ kind: "unreadable" })
})

test("counts a field of spaces only as zero", () => {
  const gap = computeGap(makeFields({ leisure: "  " }), makeFixedLines())

  expect(gap).toEqual({ kind: "left", amount: 300 } satisfies Gap)
})
