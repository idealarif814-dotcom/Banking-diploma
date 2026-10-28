import type { MetadataRoute } from 'next'
import { getAllDocuments, getExams, getSubjectsForExam } from '@/lib/data'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [exams, docs] = await Promise.all([getExams(), getAllDocuments()])
  const subjects = (await Promise.all(exams.map((e) => getSubjectsForExam(e.exam_slug)))).flat()

  return [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: 'weekly', priority: 0.5 },
    ...exams.map((e) => ({
      url: `${SITE_URL}/exam/${e.exam_slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...subjects.map((s) => ({
      url: `${SITE_URL}/exam/${s.exam_slug}/${s.subject_slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...docs.map((d) => ({
      url: `${SITE_URL}/doc/${d.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
