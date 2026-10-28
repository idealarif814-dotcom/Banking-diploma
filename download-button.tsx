'use client'

import { useState } from 'react'
import { Download, LoaderCircle } from 'lucide-react'

type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'done' } | { kind: 'error'; message: string }

export function DownloadButton({
  slug,
  fileName,
  available,
}: {
  slug: string
  fileName: string
  available: boolean
}) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function handleDownload() {
    setStatus({ kind: 'loading' })
    try {
      const res = await fetch(`/api/downloads/${slug}`, { method: 'POST' })
      const data: { url?: string; error?: string } = await res.json()
      if (!res.ok || !data.url) {
        setStatus({ kind: 'error', message: data.error ?? 'ডাউনলোড শুরু করা যায়নি' })
        return
      }
      const link = document.createElement('a')
      link.href = data.url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      setStatus({ kind: 'done' })
    } catch {
      setStatus({ kind: 'error', message: 'নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন' })
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleDownload}
        disabled={!available || status.kind === 'loading'}
        className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status.kind === 'loading' ? (
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-5" aria-hidden="true" />
        )}
        {status.kind === 'loading' ? 'প্রস্তুত হচ্ছে…' : 'PDF ডাউনলোড করুন'}
      </button>
      <p role="status" aria-live="polite" className="min-h-5 text-center text-sm">
        {!available ? (
          <span className="text-muted-foreground">PDF ফাইলটি এখনো যোগ করা হয়নি, শীঘ্রই আসছে।</span>
        ) : status.kind === 'done' ? (
          <span className="text-primary">ডাউনলোড শুরু হয়েছে।</span>
        ) : status.kind === 'error' ? (
          <span className="text-destructive">{status.message}</span>
        ) : null}
      </p>
    </div>
  )
}
