export type ChecklistItemProps = {
  title: string
  detail?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/** Item de lista de compras que fica riscado quando marcado. */
export function ChecklistItem({ title, detail, checked, onChange }: ChecklistItemProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-container-low">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 cursor-pointer rounded accent-primary" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-label-md font-medium text-on-surface group-has-[:checked]:text-outline group-has-[:checked]:line-through">{title}</span>
        {detail && <span className="text-body-sm text-outline">{detail}</span>}
      </span>
    </label>
  )
}
