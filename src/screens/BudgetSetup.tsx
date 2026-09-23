import { useState } from "react"
import FixedLine from "../components/FixedLine"
import type { FixedDraft, ScalarFields } from "../draft/types"

let nextFixedId = 1

function toAmount(value: string): number {
  if (value.trim() === "") return 0
  return Number(value.replace(",", "."))
}

const euros = new Intl.NumberFormat("fr-BE", {
  style: "currency",
  currency: "EUR",
})

export default function BudgetSetup() {
  const [fields, setFields] = useState<ScalarFields>({
    available: "",
    savingsTarget: "",
    savingsFloor: "",
    necessity: "",
    leisure: "",
  })
  const [fixedLines, setFixedLines] = useState<FixedDraft[]>([])

  function update(key: keyof ScalarFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  function addFixedLine() {
    const id = `fixed-${nextFixedId++}`
    setFixedLines((prev) => [...prev, { id, label: "", amount: "", dueDay: "" }])
  }

  function removeFixedLine(id: string) {
    setFixedLines((prev) => prev.filter((line) => line.id !== id))
  }

  function changeFixedLine(
    id: string,
    field: keyof Omit<FixedDraft, "id">,
    value: string
  ) {
    setFixedLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, [field]: value } : line))
    )
  }

  const fixedTotal = fixedLines.reduce(
    (total, line) => total + toAmount(line.amount),
    0
  )

  const toDispatch =
    toAmount(fields.available) -
    fixedTotal -
    toAmount(fields.savingsTarget) -
    toAmount(fields.necessity) -
    toAmount(fields.leisure)

  return (
    <form className="budget-setup">
      <h1>Your budget for this month</h1>

      <div className="field">
        <label htmlFor="available">Available amount</label>
        <input type="text"
               id="available"
               inputMode="numeric"
               value={fields.available}
               onChange={(e) => update("available", e.target.value)}
              />
      </div>

      <fieldset className="envelope">
        <legend>Fixed charges</legend>

        {fixedLines.map((line) => (
          <FixedLine
            key={line.id}
            line={line}
            onFieldChange={(field, value) => changeFixedLine(line.id, field, value)}
            onRemove={() => removeFixedLine(line.id)}
          />
        ))}

        <button type="button" onClick={addFixedLine}>Add a fixed charge</button>
      </fieldset>

      <fieldset className="envelope">
        <legend>Savings</legend>

        <div className="field">
          <label htmlFor="savings-target">Targeted amount</label>
          <input type="text"
                 id="savings-target"
                 inputMode="numeric"
                 value={fields.savingsTarget}
                 onChange={(e) => update("savingsTarget", e.target.value)}
                />
        </div>

        <div className="field">
          <label htmlFor="savings-floor">Minimum expected</label>
          <input type="text"
                 id="savings-floor"
                 inputMode="numeric"
                 value={fields.savingsFloor}
                 onChange={(e) => update("savingsFloor", e.target.value)}
                />
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="necessity">Necessities</label>
        <input type="text"
               id="necessity"
               inputMode="numeric"
               value={fields.necessity}
               onChange={(e) => update("necessity", e.target.value)}
              />
      </div>

      <div className="field">
        <label htmlFor="leisure">Leisure</label>
        <input type="text"
               id="leisure"
               inputMode="numeric"
               value={fields.leisure}
               onChange={(e) => update("leisure", e.target.value)}/>

      </div>

      {fields.available.trim() === "" ? (
        <p className="remaining">Enter your available amount first</p>
      ) : Number.isNaN(toDispatch) ? (
        <p className="remaining">extra to dispatch : —</p>
      ) : toDispatch < 0 ? (
        <p className="overspent">
          You'll be spending {euros.format(Math.abs(toDispatch))} more than you actually have
        </p>
      ) : (
        <p className="remaining">extra to dispatch : {euros.format(toDispatch)}</p>
      )}

      <button type="submit">Create budget</button>
    </form>
  )
}
