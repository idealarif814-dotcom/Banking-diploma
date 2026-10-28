import type { PdfDocument } from './types'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PDF_PATH_PATTERN = /^\/pdfs\/[a-z0-9][a-z0-9-_]*\.pdf$/i
const IMAGE_PATH_PATTERN = /^\/[a-z0-9/_-]+\.(png|jpe?g|webp|avif)$/i

const STRING_FIELDS = [
  'id',
  'title',
  'slug',
  'exam',
  'exam_slug',
  'subject',
  'subject_slug',
  'language',
  'source',
  'description',
  'thumbnail',
  'file_path',
] as const

export function validateDocument(input: unknown): string[] {
  const errors: string[] = []
  if (typeof input !== 'object' || input === null) return ['document must be an object']
  const doc = input as Record<string, unknown>

  for (const field of STRING_FIELDS) {
    if (typeof doc[field] !== 'string' || (doc[field] as string).trim() === '') {
      errors.push(`"${field}" must be a non-empty string`)
    }
  }
  if (errors.length > 0) return errors

  const d = doc as unknown as PdfDocument

  for (const field of ['slug', 'exam_slug', 'subject_slug'] as const) {
    if (!SLUG_PATTERN.test(d[field])) errors.push(`"${field}" is not a valid slug: ${d[field]}`)
  }
  if (d.exam.toLowerCase() !== d.exam_slug) {
    errors.push(`"exam_slug" (${d.exam_slug}) does not match "exam" (${d.exam})`)
  }
  if (!Number.isInteger(d.year) || d.year < 1970 || d.year > 2100) {
    errors.push(`"year" must be a realistic integer year`)
  }
  if (!Number.isInteger(d.pages) || d.pages <= 0) errors.push(`"pages" must be a positive integer`)
  if (!Number.isInteger(d.downloads) || d.downloads < 0) {
    errors.push(`"downloads" must be a non-negative integer`)
  }
  if (!Array.isArray(d.tags) || d.tags.some((t) => typeof t !== 'string')) {
    errors.push(`"tags" must be an array of strings`)
  }
  if (!PDF_PATH_PATTERN.test(d.file_path) || d.file_path.includes('..')) {
    errors.push(`"file_path" must look like /pdfs/<name>.pdf`)
  } else if (d.file_path !== `/pdfs/${d.slug}.pdf`) {
    errors.push(`"file_path" (${d.file_path}) must match slug: /pdfs/${d.slug}.pdf`)
  }
  if (!IMAGE_PATH_PATTERN.test(d.thumbnail) || d.thumbnail.includes('..')) {
    errors.push(`"thumbnail" must be a local image path`)
  }
  return errors
}

export function validateDocuments(input: unknown): string[] {
  if (!Array.isArray(input)) return ['documents.json must contain an array']
  const errors: string[] = []
  const seenIds = new Set<string>()
  const seenSlugs = new Set<string>()

  input.forEach((doc, index) => {
    const label = `documents[${index}]`
    for (const err of validateDocument(doc)) errors.push(`${label}: ${err}`)
    const { id, slug } = (doc ?? {}) as Partial<PdfDocument>
    if (id && seenIds.has(id)) errors.push(`${label}: duplicate id "${id}"`)
    if (slug && seenSlugs.has(slug)) errors.push(`${label}: duplicate slug "${slug}"`)
    if (id) seenIds.add(id)
    if (slug) seenSlugs.add(slug)
  })
  return errors
}
