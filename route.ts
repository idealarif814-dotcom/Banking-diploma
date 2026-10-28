import { NextResponse } from 'next/server'
import { incrementDownloads } from '@/lib/downloads'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: 'অবৈধ ডকুমেন্ট' }, { status: 400 })
  }

  const result = await incrementDownloads(slug)

  switch (result.status) {
    case 'ok':
      return NextResponse.json({
        url: result.url,
        downloads: result.downloads,
        persisted: result.persisted,
      })
    case 'not_found':
      return NextResponse.json({ error: 'ডকুমেন্টটি পাওয়া যায়নি' }, { status: 404 })
    case 'file_unavailable':
      return NextResponse.json(
        { error: 'PDF ফাইলটি এখনো যোগ করা হয়নি', reason: result.reason },
        { status: 409 },
      )
    case 'invalid_data':
      console.error('[downloads] metadata validation failed:', result.errors)
      return NextResponse.json({ error: 'ডাটা যাচাই ব্যর্থ হয়েছে' }, { status: 500 })
  }
}
