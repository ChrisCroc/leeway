import { useId } from "react"

export type FixedDraft = {
  id: string
  label: string
  amount: string
  dueDay: string
}

type FixedLineProps = {
  line: FixedDraft
  onFieldChange: (field: keyof Omit<FixedDraft, "id">, value: string) => void
  onRemove: () => void
}

export default function FixedLine({ line, onFieldChange, onRemove }: FixedLineProps) {
  const fieldId = useId()

  return (
    <div className="fixed-line">
      <div className="field">
        <label htmlFor={`${fieldId}-label`}>Label</label>
        <input type="text"
               id={`${fieldId}-label`}
               value={line.label}
               onChange={(e) => onFieldChange("label", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor={`${fieldId}-amount`}>Amount</label>
        <input type="text"
               id={`${fieldId}-amount`}
               inputMode="numeric"
               value={line.amount}
               onChange={(e) => onFieldChange("amount", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor={`${fieldId}-due-day`}>Due day</label>
        <input type="text"
               id={`${fieldId}-due-day`}
               inputMode="numeric"
               value={line.dueDay}
               onChange={(e) => onFieldChange("dueDay", e.target.value)} />
      </div>

      <button type="button" onClick={onRemove}>Remove</button>
    </div>
  )
}
