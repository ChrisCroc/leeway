import { test, expect } from "vitest"
import { canSubmit } from "./submit"
import { makeFields, makeFixedLines } from "./testHelpers"

test("allows submitting a complete and balanced budget", () => {
  const allowed = canSubmit(makeFields(), makeFixedLines())

  expect(allowed).toBe(true)
})

test("blocks submitting while some money is left to dispatch", () => {
  const allowed = canSubmit(makeFields({ leisure: "250" }), makeFixedLines())

  expect(allowed).toBe(false)
})

test("blocks submitting a balanced budget with an empty field", () => {
  const allowed = canSubmit(makeFields({ available: "1500", leisure: "" }), makeFixedLines())

  expect(allowed).toBe(false)
})

test("blocks submitting when the savings floor is empty", () => {
  const allowed = canSubmit(makeFields({ savingsFloor: ""}), makeFixedLines())

  expect(allowed).toBe(false)
})
