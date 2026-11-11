import { Icon } from '../atoms/Icon'
import { AllergenAlert, type AllergenAlertProps } from '../molecules/AllergenAlert'
import { Collapsible } from '../molecules/Collapsible'

export type IngredientsPanelProps = {
  ingredients?: string
  allergens?: AllergenAlertProps
}

/** Ingredientes (expansível) e alerta de alérgenos. Seções sem dados não aparecem. */
export function IngredientsPanel({ ingredients, allergens }: IngredientsPanelProps) {
  const hasAllergens = !!allergens && (allergens.contains.length > 0 || (allergens.mayContain?.length ?? 0) > 0)
  if (!ingredients && !hasAllergens) return null

  return (
    <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm lg:p-space-lg">
      {ingredients && (
        <Collapsible title="Lista de Ingredientes" icon="format_list_bulleted">
          <p className="leading-relaxed text-on-surface">{ingredients}</p>
          <p className="mt-space-sm flex items-center gap-2 text-label-sm text-outline">
            <Icon name="info" size={16} /> Ingredientes listados em ordem decrescente de quantidade.
          </p>
        </Collapsible>
      )}
      {hasAllergens && <AllergenAlert {...allergens} />}
    </section>
  )
}
