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

  // Level 2 - Leisure left, unless the expense already came from there
  if (missing > 0 && chargedTo !== "leisure") {
    const leisureLeft = budget.leisure.amount - spentFrom(budget, "leisure")
    const fromLeisure = Math.min(missing, leisureLeft)

    if (fromLeisure > 0) {
      withdrawals.push({ source: "leisure", amount: fromLeisure })
      missing -= fromLeisure
    }
  }

  // Level 3 - Savings, can go under floor
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

  // Level 4 - Necessity, tapping it is always flagged
  if (missing > 0 && chargedTo !== "necessity") {
    const necessityLeft = budget.necessity.amount - spentFrom(budget, "necessity")
    const fromNecessity = Math.min(missing, necessityLeft)

    if (fromNecessity > 0) {
      withdrawals.push({ source: "necessity", amount: fromNecessity })
      breaches.push({ kind: "necessityUsed", amount: fromNecessity })
      missing -= fromNecessity
    }
  }

  // Level 5 - Overdraft, absorbs whatever is left
  if (missing > 0) {
    const fromOverdraft = missing

    withdrawals.push({ source: "overdraft", amount: fromOverdraft })
    breaches.push({ kind: "overdraft", amount: fromOverdraft })
    missing -= fromOverdraft
  }

  if (breaches.length > 0) {
    return { kind: "breached", withdrawals, breaches }
  }
  return { kind: "clear", withdrawals }
}
