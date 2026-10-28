import { SITE_NAME } from '@/lib/site'
import { toBnDigits } from '@/lib/bn'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {'© '}
          {toBnDigits(new Date().getFullYear())} {SITE_NAME}
        </p>
        <p>শিক্ষার্থীদের প্রস্তুতির সুবিধার্থে প্রশ্নপত্র শেয়ার করা হয়।</p>
      </div>
    </footer>
  )
}
