import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { toBnDigits } from '@/lib/bn'
import type { ExamSummary } from '@/lib/types'

export function ExamCard({ exam }: { exam: ExamSummary }) {
  const latest = exam.years[0]
  const oldest = exam.years[exam.years.length - 1]
  const range = latest === oldest ? toBnDigits(latest) : `${toBnDigits(oldest)}–${toBnDigits(latest)}`

  return (
    <Link
      href={`/exam/${exam.exam_slug}`}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl font-bold tracking-wide text-primary">{exam.exam}</span>
        <ArrowRight
          className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
          aria-hidden="true"
        />
      </div>
      <dl className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">বিষয়</dt>
          <dd className="font-semibold">{toBnDigits(exam.subjectCount)}টি</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">PDF</dt>
          <dd className="font-semibold">{toBnDigits(exam.documentCount)}টি</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">সাল</dt>
          <dd className="font-semibold">{range}</dd>
        </div>
      </dl>
    </Link>
  )
}
