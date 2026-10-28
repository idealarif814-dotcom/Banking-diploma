import { DocumentGrid } from '@/components/document-card'
import { ExamCard } from '@/components/exam-card'
import { SearchForm } from '@/components/search-form'
import { getExams, getRecentDocuments } from '@/lib/data'

export default async function HomePage() {
  const [exams, recent] = await Promise.all([getExams(), getRecentDocuments(6)])

  return (
    <>
      <section className="border-b bg-secondary/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-10 sm:py-16">
          <p className="text-sm font-semibold text-primary">ব্যাংকিং ডিপ্লোমা পরীক্ষার প্রস্তুতি</p>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-balance sm:text-4xl">
            বিগত সালের প্রশ্ন ও উত্তর, এক জায়গায়
          </h1>
          <p className="max-w-xl text-pretty text-muted-foreground">
            AIIB, DIB, JIIB সহ বিভিন্ন পরীক্ষার প্রশ্নপত্র বিষয় ও সাল অনুযায়ী খুঁজুন এবং বিনামূল্যে
            PDF ডাউনলোড করুন।
          </p>
          <SearchForm className="max-w-2xl" />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        <section aria-labelledby="exams-heading" className="pt-10">
          <h2 id="exams-heading" className="mb-4 text-xl font-bold">
            পরীক্ষা বেছে নিন
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <li key={exam.exam_slug}>
                <ExamCard exam={exam} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="recent-heading" className="pt-10">
          <h2 id="recent-heading" className="mb-4 text-xl font-bold">
            সাম্প্রতিক PDF
          </h2>
          <DocumentGrid docs={recent} />
        </section>
      </div>
    </>
  )
}
