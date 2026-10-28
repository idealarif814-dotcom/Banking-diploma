import 'server-only'
import { readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { checkPdfFile } from './files'
import type { PdfDocument } from './types'
import { validateDocuments } from './validate-documents'

const DATA_FILE = path.join(process.cwd(), 'data', 'documents.json')

export type IncrementResult =
  | { status: 'ok'; url: string; downloads: number; persisted: boolean }
  | { status: 'not_found' }
  | { status: 'file_unavailable'; reason: string }
  | { status: 'invalid_data'; errors: string[] }

let writeQueue: Promise<unknown> = Promise.resolve()

// Every write re-reads the JSON, re-validates all metadata and confirms the
// PDF on disk is real before touching the counter. Writes are serialized so
// concurrent requests can't clobber each other.
export function incrementDownloads(slug: string): Promise<IncrementResult> {
  const task = writeQueue.then(() => runIncrement(slug))
  writeQueue = task.catch(() => undefined)
  return task
}

async function runIncrement(slug: string): Promise<IncrementResult> {
  const raw = await readFile(DATA_FILE, 'utf8')
  const parsed: unknown = JSON.parse(raw)

  const errors = validateDocuments(parsed)
  if (errors.length > 0) return { status: 'invalid_data', errors }

  const docs = parsed as PdfDocument[]
  const doc = docs.find((d) => d.slug === slug)
  if (!doc) return { status: 'not_found' }

  const file = await checkPdfFile(doc.file_path)
  if (!file.ok) return { status: 'file_unavailable', reason: file.reason }

  doc.downloads += 1

  try {
    const tmp = `${DATA_FILE}.${process.pid}.tmp`
    await writeFile(tmp, `${JSON.stringify(docs, null, 2)}\n`, 'utf8')
    await rename(tmp, DATA_FILE)
    return { status: 'ok', url: doc.file_path, downloads: doc.downloads, persisted: true }
  } catch (error) {
    // Read-only filesystems (e.g. serverless deployments) can't persist the
    // counter; the download itself should still go through.
    console.error('[downloads] could not persist counter:', (error as Error).message)
    return { status: 'ok', url: doc.file_path, downloads: doc.downloads, persisted: false }
  }
}
