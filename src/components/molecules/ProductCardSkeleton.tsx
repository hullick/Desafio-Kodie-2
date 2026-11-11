import { Skeleton } from '../atoms/Skeleton'

export type ProductCardSkeletonProps = {
  /** Mesmo formato do ProductCard: row (lista mobile) ou column (grade desktop). */
  layout?: 'row' | 'column'
}

/** Placeholder de carregamento no formato do ProductCard. */
export function ProductCardSkeleton({ layout = 'row' }: ProductCardSkeletonProps) {
  if (layout === 'column') {
    return (
      <div className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="flex justify-between">
          <Skeleton tone="soft" className="h-4 w-20 rounded" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton shimmer className="h-44 w-full rounded-xl" />
        <div className="flex gap-space-xs">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton tone="soft" className="h-6 w-28 rounded-md" />
        </div>
        <Skeleton className="h-5 w-4/5 rounded" />
        <Skeleton tone="soft" className="h-4 w-1/3 rounded" />
        <Skeleton tone="soft" className="h-14 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex items-start gap-space-md">
        <Skeleton shimmer className="h-20 w-20 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-space-xs">
          <Skeleton tone="soft" className="h-3 w-16 rounded" />
          <Skeleton className="h-5 w-4/5 rounded" />
          <Skeleton tone="soft" className="h-3 w-2/3 rounded" />
          <div className="flex items-center gap-space-xs pt-space-xs">
            <Skeleton className="h-6 w-14 rounded-lg" />
            <Skeleton tone="soft" className="h-6 w-24 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-space-sm pt-space-xs">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-space-xs rounded-lg bg-surface-container-low p-space-xs">
            <Skeleton className="h-3 w-10 rounded" />
            <Skeleton tone="soft" className="h-4 w-14 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
