import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchForm({
  defaultValue = '',
  className,
  autoFocus = false,
}: {
  defaultValue?: string
  className?: string
  autoFocus?: boolean
}) {
  return (
    <form action="/search" method="get" role="search" className={cn('w-full', className)}>
      <label htmlFor="search-q" className="sr-only">
        প্রশ্নপত্র খুঁজুন
      </label>
      <div className="flex items-center gap-2 rounded-xl border bg-card p-1.5 shadow-sm focus-within:ring-3 focus-within:ring-ring/30">
        <Search className="ml-2 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          placeholder="শিরোনাম, বিষয়, সাল বা ট্যাগ লিখুন…"
          className="h-10 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          খুঁজুন
        </button>
      </div>
    </form>
  )
}
