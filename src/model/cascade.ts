import type {
  Breach,
  ChargeableKind,
  MonthBudget,
  Verdict,
  Withdrawal,
  WithdrawalSource,
} from "./types"

function spentFrom(budget: MonthBudget, source: WithdrawalSource): number {
  return budget.expenses
    .flatMap((expense) => expense.withdrawals)
    .filter((withdrawal) => withdrawal.source === source)
    .reduce((total, withdrawal) => total + withdrawal.amount, 0)
}

export function simulatePurchase(
  budget: MonthBudget,
  amount: number,
  chargedTo: ChargeableKind
): Verdict {
    const withdrawals: Withdrawal[] = []
    const breaches: Breach[] = []
    let missing = amount

    // Level 1 - Origin envelop
    const ownLeft = budget[chargedTo].amount - spentFrom(budget, chargedTo)
    const fromOwn = Math.min(missing, ownLeft)
    if (fromOwn > 0) {
      withdrawals.push({ source: chargedTo, amount: fromOwn })
      missing -= fromOwn
    }

  // Level 2 - Savings, can go under floor
  if (missing > 0) {
    const savingsLeft = budget.savings.target - spentFrom(budget, "savings")
    const aboveFloor = Math.max(0, savingsLeft - budget.savings.floor)
    const fromSavings = Math.min(missing, savingsLeft)
    const underFloor = Math.max(0, fromSavings - aboveFloor)

    if (fromSavings > 0) {
      withdrawals.push({ source: "savings", amount: fromSavings })
      missing -= fromSavings
    }
    if (underFloor > 0) {
      breaches.push({ kind: "savingsFloor", amount: underFloor })
    }
  }
  if (breaches.length > 0) {
    return { kind: "breached", withdrawals, breaches }
  }
  return { kind: "clear", withdrawals }
}
