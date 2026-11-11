import { useState } from 'react'
import { useNavigate } from 'react-router'
import { SEARCH_SUGGESTIONS, searchHref } from '../../config/search'
import { Button } from '../atoms/Button'
import { Modal } from '../molecules/Modal'
import { SearchBarGlobal } from '../molecules/SearchBarGlobal'
import { SearchSuggestions } from '../molecules/SearchSuggestions'

export type SearchModalProps = {
  open: boolean
  onClose: () => void
}

/**
 * Busca a partir de qualquer tela (lupa do cabeçalho): leva para a Home buscando o termo,
 * que aparece no campo de busca dela. Só busca ao enviar (a API limita buscas a 10/min).
 */
export function SearchModal({ open, onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const [term, setTerm] = useState('')

  const search = (value: string) => {
    const t = value.trim()
    if (!t) return
    onClose()
    setTerm('')
    navigate(searchHref(t))
  }

  return (
    <Modal open={open} onClose={onClose} icon="search" title="Buscar alimentos" description="Produto, marca ou ingrediente.">
      <SearchBarGlobal value={term} onChange={setTerm} onSubmit={search} placeholder="Ex.: iogurte natural" autoFocus />
      <SearchSuggestions items={SEARCH_SUGGESTIONS} onSelect={search} />
      <Button icon="search" fullWidth className="h-12" disabled={!term.trim()} onClick={() => search(term)}>
        Buscar
      </Button>
    </Modal>
  )
}
