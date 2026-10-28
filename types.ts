export interface PdfDocument {
  id: string
  title: string
  slug: string
  exam: string
  exam_slug: string
  subject: string
  subject_slug: string
  year: number
  language: string
  pages: number
  source: string
  description: string
  tags: string[]
  thumbnail: string
  file_path: string
  downloads: number
}

export interface ExamSummary {
  exam: string
  exam_slug: string
  subjectCount: number
  documentCount: number
  years: number[]
}

export interface SubjectSummary {
  subject: string
  subject_slug: string
  exam: string
  exam_slug: string
  documentCount: number
  years: number[]
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
