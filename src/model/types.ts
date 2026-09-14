export type FixedEnvelope = {
  kind: "fixed"
  label: string
  amount: number
  dueDay: number
}

export type SavingsEnvelope = {
  kind: "savings"
  target: number
  floor: number
}

export type NecessityEnvelope = {
  kind: "necessity"
  amount: number
}

export type LeisureEnvelope = {
  kind: "leisure"
  amount: number
}

export type Envelope =
  | FixedEnvelope
  | SavingsEnvelope
  | NecessityEnvelope
  | LeisureEnvelope

export type WithdrawalSource = "savings" | "necessity" | "leisure"

export type Withdrawal = {
  source: WithdrawalSource
  amount: number
}

export type ChargeableKind = "necessity" | "leisure"

export type Expense = {
  chargedTo: ChargeableKind
  date: string
  withdrawals: Withdrawal[]
}

export type MonthBudget = {
  available: number
  fixed: FixedEnvelope[]
  savings: SavingsEnvelope
  necessity: NecessityEnvelope
  leisure: LeisureEnvelope
  expenses: Expense[]
}
