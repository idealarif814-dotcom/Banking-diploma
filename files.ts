import 'server-only'
import { open, stat } from 'node:fs/promises'
import path from 'node:path'

const PDF_ROOT = path.join(process.cwd(), 'public', 'pdfs')

function resolvePublicPdf(filePath: string): string | null {
  const absolute = path.join(process.cwd(), 'public', filePath)
  const relative = path.relative(PDF_ROOT, absolute)
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null
  return absolute
}

export type PdfCheck =
  | { ok: true; size: number }
  | { ok: false; reason: 'invalid_path' | 'missing' | 'not_pdf' }

export async function checkPdfFile(filePath: string): Promise<PdfCheck> {
  const absolute = resolvePublicPdf(filePath)
  if (!absolute) return { ok: false, reason: 'invalid_path' }

  try {
    const info = await stat(absolute)
    if (!info.isFile() || info.size === 0) return { ok: false, reason: 'missing' }

    const handle = await open(absolute, 'r')
    try {
      const header = Buffer.alloc(5)
      await handle.read(header, 0, 5, 0)
      if (header.toString('ascii') !== '%PDF-') return { ok: false, reason: 'not_pdf' }
    } finally {
      await handle.close()
    }
    return { ok: true, size: info.size }
  } catch {
    return { ok: false, reason: 'missing' }
  }
}
