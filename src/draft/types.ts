export type ScalarFields = {
  available: string
  savingsTarget: string
  savingsFloor: string
  necessity: string
  leisure: string
}

export type FixedDraft = {
  id: string
  label: string
  amount: string
  dueDay: string
}

export type Gap =
  | { kind: "unreadable" }
  | { kind: "balanced" }
  | { kind: "left"; amount: number }
  | { kind: "over"; amount: number }

