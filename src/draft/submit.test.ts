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
  const allowed = canSubmit(makeFields({ savingsFloor: "" }), makeFixedLines())

  expect(allowed).toBe(false)
})

test("blocks submitting when a fixed charge has no label", () => {
  const allowed = canSubmit(makeFields(), makeFixedLines({ label: " " }))

  expect(allowed).toBe(false)
})

test("blocks submitting a balanced budget when a fixed charge has no amount", () => {
  const allowed = canSubmit(
    makeFields({ available: "1050" }),
    makeFixedLines({ amount: "" }))

  expect(allowed).toBe(false)
})

test("blocks submitting when a fixed charge has no due day", () => {
  const allowed = canSubmit(makeFields(), makeFixedLines({ dueDay: "" }))

  expect(allowed).toBe(false)
})

test("accepts the 31st as a due day", () => {
  const allowed = canSubmit(makeFields(), makeFixedLines({ dueDay: "31" }))

  expect(allowed).toBe(true)
})

test("blocks submitting a due day after the 31st", () => {
  const allowed = canSubmit(makeFields(), makeFixedLines({ dueDay: "32" }))

  expect(allowed).toBe(false)
})

test("blocks submitting a due day of zero", () => {
  const allowed = canSubmit(makeFields(), makeFixedLines({ dueDay: "0" }))

  expect(allowed).toBe(false)
})

test("blocks submitting a due day that is not a number", () => {
  const allowed = canSubmit(makeFields(), makeFixedLines({ dueDay: "abc" }))

  expect(allowed).toBe(false)
})
