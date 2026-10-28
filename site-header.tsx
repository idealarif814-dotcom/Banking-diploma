import Link from 'next/link'
import { BookOpenText, Search } from 'lucide-react'
import { SITE_NAME } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        মূল কনটেন্টে যান
      </a>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenText className="size-4" aria-hidden="true" />
          </span>
          <span className="text-base sm:text-lg">{SITE_NAME}</span>
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Search className="size-4" aria-hidden="true" />
          <span>খুঁজুন</span>
        </Link>
      </div>
    </header>
  )
}
