import { Chip } from '../atoms/Chip'

export type SearchSuggestionsProps = {
  items: string[]
  onSelect: (term: string) => void
  title?: string
}

/** Lista de sugestões rápidas de busca. */
export function SearchSuggestions({ items, onSelect, title = 'Sugestões rápidas:' }: SearchSuggestionsProps) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="text-[10px] tracking-wider text-outline uppercase">{title}</span>
      {items.map((term) => (
        <Chip key={term} size="sm" onClick={() => onSelect(term)}>
          {term}
        </Chip>
      ))}
    </div>
  )
}
