import 'server-only'
import documentsJson from '@/data/documents.json'
import { toEnDigits } from './bn'
import type { ExamSummary, PaginatedResult, PdfDocument, SubjectSummary } from './types'
import { validateDocuments } from './validate-documents'

// Single access point for document data. Swap the body of `loadDocuments`
// for a Supabase query later; every page goes through these functions.
const validationErrors = validateDocuments(documentsJson)
if (validationErrors.length > 0) {
  throw new Error(`data/documents.json is invalid:\n- ${validationErrors.join('\n- ')}`)
}

const documents = documentsJson as PdfDocument[]

async function loadDocuments(): Promise<PdfDocument[]> {
  return documents
}

const byRecency = (a: PdfDocument, b: PdfDocument) =>
  b.year - a.year || b.id.localeCompare(a.id)

function uniqueSortedYears(docs: PdfDocument[]): number[] {
  return [...new Set(docs.map((d) => d.year))].sort((a, b) => b - a)
}

export async function getAllDocuments(): Promise<PdfDocument[]> {
  return [...(await loadDocuments())].sort(byRecency)
}

export async function getRecentDocuments(limit = 6): Promise<PdfDocument[]> {
  return (await getAllDocuments()).slice(0, limit)
}

export async function getDocumentBySlug(slug: string): Promise<PdfDocument | null> {
  return (await loadDocuments()).find((d) => d.slug === slug) ?? null
}

export async function getExams(): Promise<ExamSummary[]> {
  const docs = await loadDocuments()
  const groups = new Map<string, PdfDocument[]>()
  for (const doc of docs) {
    groups.set(doc.exam_slug, [...(groups.get(doc.exam_slug) ?? []), doc])
  }
  return [...groups.values()]
    .map((group) => ({
      exam: group[0].exam,
      exam_slug: group[0].exam_slug,
      subjectCount: new Set(group.map((d) => d.subject_slug)).size,
      documentCount: group.length,
      years: uniqueSortedYears(group),
    }))
    .sort((a, b) => a.exam.localeCompare(b.exam))
}

export async function getExamBySlug(examSlug: string): Promise<ExamSummary | null> {
  return (await getExams()).find((e) => e.exam_slug === examSlug) ?? null
}

export async function getDocumentsByExam(examSlug: string): Promise<PdfDocument[]> {
  return (await getAllDocuments()).filter((d) => d.exam_slug === examSlug)
}

export async function getSubjectsForExam(examSlug: string): Promise<SubjectSummary[]> {
  const docs = await getDocumentsByExam(examSlug)
  const groups = new Map<string, PdfDocument[]>()
  for (const doc of docs) {
    groups.set(doc.subject_slug, [...(groups.get(doc.subject_slug) ?? []), doc])
  }
  return [...groups.values()]
    .map((group) => ({
      subject: group[0].subject,
      subject_slug: group[0].subject_slug,
      exam: group[0].exam,
      exam_slug: group[0].exam_slug,
      documentCount: group.length,
      years: uniqueSortedYears(group),
    }))
    .sort((a, b) => a.subject.localeCompare(b.subject, 'bn'))
}

export async function getSubject(
  examSlug: string,
  subjectSlug: string,
): Promise<SubjectSummary | null> {
  const subjects = await getSubjectsForExam(examSlug)
  return subjects.find((s) => s.subject_slug === subjectSlug) ?? null
}

export async function getDocumentsBySubject(
  examSlug: string,
  subjectSlug: string,
): Promise<PdfDocument[]> {
  return (await getDocumentsByExam(examSlug)).filter((d) => d.subject_slug === subjectSlug)
}

export function groupByYear(docs: PdfDocument[]): { year: number; documents: PdfDocument[] }[] {
  return uniqueSortedYears(docs).map((year) => ({
    year,
    documents: docs.filter((d) => d.year === year),
  }))
}

function normalize(value: string): string {
  return toEnDigits(value).toLowerCase().normalize('NFC').trim()
}

export async function searchDocuments(
  query: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResult<PdfDocument>> {
  const tokens = normalize(query).split(/\s+/).filter(Boolean)
  const all = await getAllDocuments()

  const matches =
    tokens.length === 0
      ? []
      : all.filter((doc) => {
          const haystack = normalize(
            [doc.title, doc.subject, doc.exam, String(doc.year), ...doc.tags].join(' '),
          )
          return tokens.every((token) => haystack.includes(token))
        })

  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize))
  const safePage = Math.min(Math.max(1, Math.floor(page) || 1), totalPages)
  const start = (safePage - 1) * pageSize

  return {
    items: matches.slice(start, start + pageSize),
    total: matches.length,
    page: safePage,
    pageSize,
    totalPages,
  }
}
