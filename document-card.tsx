import Image from 'next/image'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { toBnDigits } from '@/lib/bn'
import type { PdfDocument } from '@/lib/types'

export function DocumentCard({ doc }: { doc: PdfDocument }) {
  return (
    <article className="group relative flex gap-4 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-24">
        <Image
          src={doc.thumbnail}
          alt=""
          fill
          sizes="96px"
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-0.5">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground">
            {doc.exam}
          </span>
          <span className="rounded-md bg-accent/50 px-2 py-0.5 text-accent-foreground">
            {toBnDigits(doc.year)}
          </span>
        </div>
        <h3 className="line-clamp-2 font-semibold leading-snug text-pretty">
          <Link href={`/doc/${doc.slug}`} className="after:absolute after:inset-0">
            {doc.title}
          </Link>
        </h3>
        <p className="truncate text-sm text-muted-foreground">{doc.subject}</p>
        <p className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
          <FileText className="size-3.5" aria-hidden="true" />
          {toBnDigits(doc.pages)} পৃষ্ঠা · {doc.language}
        </p>
      </div>
    </article>
  )
}

export function DocumentGrid({ docs }: { docs: PdfDocument[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {docs.map((doc) => (
        <li key={doc.id}>
          <DocumentCard doc={doc} />
        </li>
      ))}
    </ul>
  )
}
