import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toBnDigits } from '@/lib/bn'
import { cn } from '@/lib/utils'

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number
  totalPages: number
  buildHref: (page: number) => string
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  )

  const linkBase =
    'flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors'

  return (
    <nav aria-label="পেজিনেশন" className="mt-8 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className={cn(linkBase, 'bg-card hover:bg-muted')}>
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span className="sr-only">আগের পেজ</span>
        </Link>
      ) : null}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 ? (
            <span className="px-1 text-muted-foreground" aria-hidden="true">
              …
            </span>
          ) : null}
          <Link
            href={buildHref(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              linkBase,
              p === page
                ? 'border-primary bg-primary text-primary-foreground'
                : 'bg-card hover:bg-muted',
            )}
          >
            {toBnDigits(p)}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className={cn(linkBase, 'bg-card hover:bg-muted')}>
          <ChevronRight className="size-4" aria-hidden="true" />
          <span className="sr-only">পরের পেজ</span>
        </Link>
      ) : null}
    </nav>
  )
}
